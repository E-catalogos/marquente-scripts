import fs from 'fs';
import multer from 'multer';
import path from 'path';

export class ExcelMiddleware {
  constructor () {
    this.verifyDir();

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
      }
    });

    this.upload = multer({ storage });

    this.validateFile = this.validateFile.bind(this);
    this.validateSheet = this.validateSheet.bind(this);
  }

  verifyDir () {
    const uploadDir = path.resolve('src/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  single () {
    return this.upload.single('file');
  }

  validateFile (req, res, next) {
    const sheetTypes = ['application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

    if (!req.file) {
      return res.status(400).json({ message: 'Adicione um arquivo' });
    }

    if (!sheetTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Tipo de arquivo inválido' });
    }
    next();
  }
}
