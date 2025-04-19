import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis('redis://redis:6379');

export const ocrQueue = new Queue('ocrQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false
  }
});
