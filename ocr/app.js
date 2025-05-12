import express from 'express';
import multer from 'multer';
import path from 'path';
import { ocrQueue } from './queue.js';
import { authenticate, rateLimit } from './auth.js';
import admin from './admin.js';
import fs from 'fs/promises';
import crypto from 'crypto';

const API_KEY = process.env.API_KEY || 'default-key';

// function authenticate(req, res, next) {
//   const key = req.headers['x-api-key'];
//   if (!key || key !== API_KEY) {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }
//   next();
// }

const app = express();
// app.use(admin);

const upload = multer({ dest: 'uploads/' });
// app.use(admin);

app.use(express.json({ limit: '50mb' }));

app.get('/test', (req, res) => {
  console.log('test');
  res.json({ success: true, message: 'Hello, world!' });
});

app.post('/ocr', async (req, res) => {
  const callbackUrl = req.body.callbackUrl;
  const images = req.body.images; // Expecting array of { key, data }

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one image is required' });
  }

  try {
    // Save each base64 image to a file
    const fileInfos = await Promise.all(images.map(async (imgObj) => {
      const { key, data } = imgObj;
      if (!key || !data) throw new Error('Each image must have a key and data');
      // Generate a unique filename
      const ext = data.startsWith('data:image/png') ? '.png' : data.startsWith('data:image/jpeg') ? '.jpg' : '';
      const filename = `uploads/${crypto.randomUUID()}_${key}${ext}`;
      // Remove base64 header if present
      const base64Data = data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      await fs.writeFile(filename, base64Data, 'base64');
      return filename;
    }));

    const jobs = await Promise.all(fileInfos.map(filePath =>
      ocrQueue.add('ocr-job', {
        imagePath: path.resolve(filePath),
        callbackUrl
      })
    ));

    const jobIds = jobs.map(job => job.id);

    return res.json({
      success: true,
      jobIds
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Failed to queue OCR jobs' });
  }
});

// Job status endpoint
app.get('/ocr/:id', async (req, res) => {
  const { id } = req.params;
  const job = await ocrQueue.getJob(id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const state = await job.getState();
  const result = job.returnvalue;

  return res.json({
    success: true,
    status: state,
    result: result || null
  });
});

app.listen(8000, () => {
  console.log('OCR API server running on port 8000');
});
