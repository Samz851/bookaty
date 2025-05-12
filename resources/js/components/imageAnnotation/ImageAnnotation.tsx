import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { Button } from 'antd';
import { useApiUrl } from '@refinedev/core';
import { Request } from "@/helpers/httpHelper";
import Echo from 'laravel-echo';

interface WebhookData {
  [key: string]: any;
}
interface WordItem {
  id: string;
  text: string;
  used: boolean;
}

interface Annotation {
  id: string;
  wordId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  croppedImage?: string; // Base64 string of the cropped image
}

interface ImageAnnotationProps {
  words: string[];
  onAnnotationsChange?: (annotations: Annotation[]) => void;
}

const ImageAnnotation: React.FC<ImageAnnotationProps> = ({ words, onAnnotationsChange }) => {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [wordItems, setWordItems] = useState<WordItem[]>(words.map(text => ({ id: uuidv4(), text, used: false })));
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [dragPreview, setDragPreview] = useState<{ width: number; height: number } | null>(null);
  const [draggedAnnotation, setDraggedAnnotation] = useState<Annotation | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const apiUrl = useApiUrl('laravel');
  const [ocrJobId, setOcrJobId] = useState<string | null>(null);
  const [ocrJobStatus, setOcrJobStatus] = useState<any | null>(null);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    // Initialize Laravel Echo
    const echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true
    });

    // Listen for webhook events
    echo.channel('webhooks')
        .listen('WebhookReceived', (e: { data: WebhookData }) => {
          console.log('WebhookReceived', e.data);
            setWebhooks(prev => [...prev, e.data]);
        });

    // Cleanup on unmount
    return () => {
        echo.leave('webhooks');
    };
}, []);

  const handleDragStart = (e: React.DragEvent, item: WordItem) => {
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDragPreview({
      width: rect.width,
      height: rect.height
    });
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: item.id,
      text: item.text,
      width: rect.width,
      height: rect.height
    }));
  };

  const handleAnnotationDragStart = (e: React.DragEvent, annotation: Annotation) => {
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedAnnotation(annotation);
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'annotation',
      id: annotation.id
    }));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!imageRef.current || !containerRef.current || !dragOffset) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (dragData.type === 'annotation') {
        // Handle annotation repositioning
        if (draggedAnnotation) {
          const updatedAnnotation = {
            ...draggedAnnotation,
            x,
            y
          };
          const croppedAnnotation = await handleAnnotationUpdate(updatedAnnotation);
          setAnnotations(annotations.map(annotation => {
            if (annotation.id === draggedAnnotation.id) {
              return croppedAnnotation;
            }
            return annotation;
          }));
          setDraggedAnnotation(null);
        }
      } else {
        // Handle new word drop
        const wordItem = wordItems.find(item => item.id === dragData.id);
        
        if (!wordItem || wordItem.used) return;

        const newAnnotation: Annotation = {
          id: uuidv4(),
          wordId: dragData.id,
          x,
          y,
          width: dragData.width,
          height: dragData.height,
          text: dragData.text
        };

        const croppedAnnotation = await handleAnnotationUpdate(newAnnotation);
        setAnnotations([...annotations, croppedAnnotation]);
        setWordItems(wordItems.map(item => 
          item.id === dragData.id ? { ...item, used: true } : item
        ));
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    } finally {
      setDragOffset(null);
    }
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    const annotation = annotations.find(a => a.id === annotationId);
    if (annotation) {
      setAnnotations(annotations.filter(a => a.id !== annotationId));
      setWordItems(wordItems.map(item => 
        item.id === annotation.wordId ? { ...item, used: false } : item
      ));
    }
  };

  const handleResize = async (id: string, newWidth: number, newHeight: number) => {
    const updatedAnnotations = await Promise.all(
      annotations.map(async (annotation) => {
        if (annotation.id === id) {
          const updatedAnnotation = {
            ...annotation,
            width: newWidth,
            height: newHeight
          };
          return await handleAnnotationUpdate(updatedAnnotation);
        }
        return annotation;
      })
    );
    setAnnotations(updatedAnnotations);
  };

  useEffect(() => {
    onAnnotationsChange?.(annotations);
  }, [annotations, onAnnotationsChange]);

  const handleOcr = async () => {
    let url = `${apiUrl}/ocr`;
    let formData = new FormData();
    formData.append('image', imageFile as Blob);
    formData.append('annotations', JSON.stringify(annotations.map(annotation => ({
      ...annotation,
      croppedImage: annotation.croppedImage
    }))));
    let res = await Request('POST', url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('OCR', res);
    setOcrJobId(res.data.jobId);
  };

  const getOcrJobStatus = async () => {
    let url = `${apiUrl}/ocr?jobId=${ocrJobId}`;
    let res = await Request('GET', url, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setOcrJobStatus(res.data);
    console.log('OCR Job Status', res.data);
  };

  const cropAnnotation = (annotation: Annotation): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current) {
        reject('No image reference found');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get canvas context');
        return;
      }

      // Set canvas dimensions to match annotation size
      canvas.width = annotation.width;
      canvas.height = annotation.height;

      // Draw the cropped region
      ctx.drawImage(
        imageRef.current,
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height,
        0,
        0,
        annotation.width,
        annotation.height
      );

      // Convert to base64
      const croppedImage = canvas.toDataURL('image/png');
      resolve(croppedImage);
    });
  };

  const handleAnnotationUpdate = async (annotation: Annotation) => {
    try {
      const croppedImage = await cropAnnotation(annotation);
      return {
        ...annotation,
        croppedImage
      };
    } catch (error) {
      console.error('Error cropping annotation:', error);
      return annotation;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>

        <div className="flex gap-4">
          <div 
            className="flex-1 relative" 
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {image && (
              <img
                ref={imageRef}
                src={image}
                alt="Uploaded"
                className="max-w-full h-auto"
              />
            )}
            {annotations.map(annotation => (
              <div
                key={annotation.id}
                className="absolute border-2 border-blue-500 bg-blue-500/20 p-2 rounded cursor-move"
                style={{
                  left: `${annotation.x}px`,
                  top: `${annotation.y}px`,
                  width: `${annotation.width}px`,
                  height: `${annotation.height}px`,
                }}
                draggable
                onDragStart={(e) => handleAnnotationDragStart(e, annotation)}
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm text-blue-700 truncate flex-1">{annotation.text}</div>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-br"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = annotation.width;
                    const startHeight = annotation.height;

                    const handleMouseMove = (e: MouseEvent) => {
                      const newWidth = startWidth + (e.clientX - startX);
                      const newHeight = startHeight + (e.clientY - startY);
                      handleResize(annotation.id, Math.max(50, newWidth), Math.max(30, newHeight));
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="w-64">
            <h3 className="text-lg font-semibold mb-2">Available Words</h3>
            <div className="space-y-2">
              {wordItems.map(item => (
                <div
                  key={item.id}
                  className={`p-2 border rounded cursor-move transition-colors ${
                    item.used ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
                  }`}
                  draggable={!item.used}
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button type="primary" onClick={handleOcr}>OCR</Button>
        <Button type="primary" onClick={getOcrJobStatus}>Get OCR Job Status</Button>
      </div>
    </DndProvider>
  );
};

export default ImageAnnotation; 