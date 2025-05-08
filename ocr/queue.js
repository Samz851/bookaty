import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import IORedis from 'ioredis';

const queue = [];
let isProcessing = false;

export const addToQueue = (job) => {
  queue.push(job);
  processQueue();
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const job = queue.shift();
  try {
    const result = await job.handler();
    job.resolve(result);
  } catch (err) {
    job.reject(err);
  } finally {
    isProcessing = false;
    processQueue();
  }
};


const connection = new IORedis('redis://redis:6379');

export const ocrQueue = new Queue('ocrQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false
  }
});
