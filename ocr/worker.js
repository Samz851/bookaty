import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processOCR } from './processor.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const connection = new IORedis('redis://redis:6379');

const worker = new Worker('ocrQueue', async job => {
  const { imagePath, callbackUrl } = job.data;
  const text = await processOCR(imagePath);
  console.log('text',text);

  // Write text to JSON file
  const outputPath = path.join(process.cwd(), 'ocr_output', `${job.id}.json`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(text));
  console.log(`OCR text written to ${outputPath}`);

  if (callbackUrl) {
    try {
      await axios.post(callbackUrl, {
        jobId: job.id,
        status: 'completed',
        text
      });
    } catch (err) {
      console.error(`Failed to send webhook to ${callbackUrl}`, err.message);
    }
  }

  return { text };
}, { connection });

worker.on('completed', job => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
