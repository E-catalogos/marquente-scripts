import fs from 'fs';
import { ExcelUtils } from '../utils/excelTransform.js';

export class ExcelController {
  constructor () {
    this.utils = new ExcelUtils();
  }

  async upload (req, res) {
    const excelFile = req.file;
    const transformedJSON = this.utils
      .transformProductStocksToJSON(excelFile.path, 'reference', 'stock');
    fs.writeFileSync('src/data/productStocks.json', JSON.stringify(transformedJSON));
    res.status(200).json({ message: 'Arquivo enviado com sucesso' });
  }
}
