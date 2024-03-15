import { Router } from 'express';

const router = Router();

router.post('/upload', (req, res) => {
  res.json({ message: 'File uploaded' });
});
