import XLSX from 'xlsx';

export class ExcelUtils {
  readExcelFile = (file) => {
    const readOptions = {
      raw: true
    };

    const sheetOptions = {
      defval: 0,
      raw: true
    };

    const workbook = XLSX.readFile(file, readOptions);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, sheetOptions);
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
