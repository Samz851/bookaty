import Tesseract from 'tesseract.js';
import fs from 'fs/promises';

export async function processOCR(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'ara');
  await fs.unlink(imagePath);
  return result.data.text;
}
