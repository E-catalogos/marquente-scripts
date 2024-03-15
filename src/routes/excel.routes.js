import { Router } from 'express';
import { ExcelController } from '../controller/excel.controller.js';
import { ExcelMiddleware } from '../middleware/excel.middleware.js';

const router = Router();

const excelMiddleware = new ExcelMiddleware();
const excelController = new ExcelController();

router.post(
  '/upload',
  excelMiddleware.single(),
  excelMiddleware.validateFile,
  (req, res) => excelController.upload(req, res)
);

export default router;
