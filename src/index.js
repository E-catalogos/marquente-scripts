import { productsStocks } from './data/productStocks.js';
import Database from './database/mysql.js';
export class Products {
  constructor () {
    this.db = new Database();
  }

  async verifyStocks (oldStocks, newStocks) {
    const verifiedStocks = oldStocks.map((oldStock) => {
      const verify = +oldStock.stock === +newStocks
        .find((newStock) => newStock.productId === oldStock.productId).stock;
      if (!verify) {
        console.log(`Estoque do produto ${oldStock.productId} não foi atualizado corretamente.`);
      }
      return verify;
    });
    return verifiedStocks;
  }

  async getProductsStocksByIds (productIds) {
    const query = `

      SELECT
        fk_produtos as productId,
        ifp_estoque_interno as stock
      FROM info_produtos
      WHERE
        fk_produtos = ?
    `;
    try {
      const promises = productIds.map(async (productId) => {
        const stocks = await this.db.query(query, [productId.id]);
        return stocks;
      });
      const stocks = await Promise.all(promises);
      return stocks;
    } catch (error) {
      console.error('Erro ao verificar estoque do produto:', error);
      throw error;
    }
  }

  async getProductIdByReference (reference) {
    const query = `
      SELECT id
      FROM produtos
      WHERE 
        prd_referencia = ? AND
        excluido = 0
    `;
    try {
      const id = await this.db.query(query, [reference]);
      return id[0];
    } catch (error) {
      console.error('Erro ao buscar produto por referência:', error);
      throw error;
    }
  }

  async updateManyStocks (productsStocks) {
    console.log('----------PEGANDO IDS DOS PRODUTOS----------');
    const productsIds = await Promise.all(productsStocks.map(async ({ reference }) => {
      const productId = await this.getProductIdByReference(reference);
      return productId;
    }));
    console.log('----------IDS DOS PRODUTOS PEGOS----------');
    console.log(`----------${productsIds.length} ENCONTRADOS----------`);
    const productsIdsStocks = productsIds.map((productId, index) => ({
      productId: productId.id,
      stock: productsStocks[index].stock
    }));

    console.log('----------ATUALIZANDO ESTOQUES----------');
    const promises = productsIdsStocks.map(async ({ productId, stock }, i) => {
      await this.updateStock(productId, stock);

      // eslint-disable-next-line max-len
      console.log(`Estoque do produto ${productId} atualizado para ${stock} - ${i} de ${productsIdsStocks.length}`);
    });

    try {
      await Promise.all(promises);
      console.log('----------ESTOQUES ATUALIZADOS----------');
      console.log('----------VERIFICANDO ESTOQUES----------');
      const updatedStocks = (await this.getProductsStocksByIds(productsIds)).flat();
      const verifiedStocks = await this.verifyStocks(productsIdsStocks, updatedStocks);
      if (verifiedStocks.includes(false)) {
        console.log('Algum estoque não foi atualizado corretamente. Verifique os logs.');
      } else {
        console.log('Todos os estoques foram atualizados corretamente.');
      }
      console.log('----------ESTOQUES VERIFICADOS----------');
      process.exit();
    } catch (error) {
      console.error('Erro ao atualizar estoques:', error);
      throw error;
    }
  }

  async updateStock (productId, stock) {
    const query = `
      UPDATE info_produtos
      SET ifp_estoque_interno = ?
      WHERE
        fk_produtos = ?
    `;
    const values = [+stock, productId];
    try {
      await this.db.query(query, values);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }
}

const products = new Products();
products.updateManyStocks(productsStocks);
