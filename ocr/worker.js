import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processOCR } from './processor.js';
import axios from 'axios';

const connection = new IORedis('redis://redis:6379');

const worker = new Worker('ocrQueue', async job => {
  const { imagePath, callbackUrl } = job.data;
  const text = await processOCR(imagePath);
  console.log('text',text);

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
