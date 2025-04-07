// Helpers for images and file uploads
export const fileTypes = {
  file: '/images/thumbs/file.png',
  audio: '/images/thumbs/audio.png',
  doc: '/images/thumbs/doc.png',
  pdf: '/images/thumbs/pdf.png',
  video: '/images/thumbs/video.png',
  xls: '/images/thumbs/xls.png'
};
export const getBase64 = file => {
  console.log('the file is', file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
