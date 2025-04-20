import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

export async function processOCR(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'ara');
  await fs.unlink(imagePath); // Clean up
  return result.data.text;
}
