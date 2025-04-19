import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { processOCR } from './processor.js';
import axios from 'axios';

const connection = new IORedis('redis://redis:6379');

const worker = new Worker('ocrQueue', async job => {
  const { imagePath, callbackUrl } = job.data;
  const text = await processOCR(imagePath);
  if (callbackUrl) {
    await axios.post(callbackUrl, {
      jobId: job.id,
      status: 'completed',
      text
    }).catch(console.error);
  }
  return { text };
}, { connection });
