import express from 'express';
import multer from 'multer';
import path from 'path';
import { ocrQueue } from './queue.js';
import { authenticate, rateLimit } from './auth.js';
import admin from './admin.js';

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

app.get('/test', (req, res) => {
  console.log('test');
  res.json({ success: true, message: 'Hello, world!' });
});

app.post('/ocr', upload.array('images', 10), async (req, res) => {
  const callbackUrl = req.body.callbackUrl;
  console.log(req.files);
  console.log(req.images);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one image is required' });
  }

  try {
    const jobs = await Promise.all(req.files.map(file =>
      ocrQueue.add('ocr-job', {
        imagePath: path.resolve(file.path),
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
