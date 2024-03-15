import * as XLSX from 'xlsx';

export class ExcelUtils {
  readExcelFile = (file) => {
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data;
  };

  transformProductStocksToJSON = (file, columnReferenceName, columnStockName) => {
    const excelToJson = this.readExcelFile(file);

    const transformedJSON = excelToJson.map((product) => ({
      reference: product[columnReferenceName],
      stock: product[columnStockName]
    }));

    return transformedJSON;
  };
}
