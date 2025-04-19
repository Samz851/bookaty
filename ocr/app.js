import express from 'express';
import multer from 'multer';
import path from 'path';
import { ocrQueue } from './queue.js';
import { authenticate, rateLimit } from './auth.js';
import admin from './admin.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(admin); // Admin UI

app.post('/ocr', authenticate, rateLimit, upload.array('images', 10), async (req, res) => {
  const callbackUrl = req.body.callbackUrl;
  const jobs = await Promise.all(req.files.map(file =>
    ocrQueue.add('ocr-job', {
      imagePath: path.resolve(file.path),
      callbackUrl
    })
  ));
  res.json({ success: true, jobIds: jobs.map(job => job.id) });
});

app.get('/ocr/:id', authenticate, rateLimit, async (req, res) => {
  const job = await ocrQueue.getJob(req.params.id);
  if (!job) return res.status(404).json({ success: false });
  const state = await job.getState();
  res.json({ success: true, status: state, result: job.returnvalue || null });
});

app.listen(8000, () => console.log("OCR service listening on port 8000"));
