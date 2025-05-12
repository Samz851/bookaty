<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\HasFileUploads;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Contracts\Tenant;

class OcrController extends Controller
{
    use HasFileUploads;
    public function ocr(Request $request, Tenant $tenant)
    {
        // TODO: Implement OCR functionality
        if ($request->file('image')) {
            $directory = 'images/'.$tenant->id;
            $image = $request->file('image');
            $annotations = $request->input('annotations');
            if ($fileUploadedData = $this->uploadSingleFile($image, $directory)) {
                // $request->merge(['image' => 'storage/'.$fileUploadedData['filepath']]);
                $ocrRequestData = array_map(function($annotation) {
                    return [
                        $annotation['wordId'] => $annotation['croppedImage']];
                    }, $annotations);
                $response = Http::post('http://ocr-service:8000/ocr', ['images' => $ocrRequestData, 'callbackUrl' => 'http://laravel.test/webhook']);
                Log::info($response->json('jobIds'), [__FILE__, __LINE__]);
                $jobIds = $response->json('jobIds');
                return response()->json(['message' => 'OCR endpoint', 'jobId' => $jobIds[0]]);
            }
            return response()->json(['img' => $image, 'annotations' => $annotations, 'message' => 'OCR endpoint']);
        }
        return response()->json(['message' => 'No image uploaded']);
    }
    public function getOcrJobStatus(Request $request, Tenant $tenant)
    {
        $jobId = $request->query('jobId');
        $response = Http::get('http://ocr-service:8000/ocr/'.$jobId);
        return response()->json(['message' => 'OCR job status', 'status' => $response->json()]);
    }
} 
