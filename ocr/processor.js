import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

export async function processOCR(imagePath) {
  const worker = await Tesseract.createWorker('ara');
  const result = await worker.recognize(imagePath, {}, {box: true});
  await fs.unlink(imagePath); // Clean up
  return result.data.blocks;
}
