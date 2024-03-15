import { Router } from 'express';
import excelRoutes from './excel.routes.js';

const router = Router();

router.use('/excel', excelRoutes);

export default router;
