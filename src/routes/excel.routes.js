import { Router } from 'express';
import { ExcelController } from '../controller/excel.controller';
import { ExcelMiddleware } from '../middleware/excel.middleware';

const router = Router();

const excelMiddleware = new ExcelMiddleware();
const excelController = new ExcelController();

router.post(
  '/upload',
  excelMiddleware.single(),
  excelMiddleware.validateFile,
  (req, res) => excelController.upload(req, res)
);
