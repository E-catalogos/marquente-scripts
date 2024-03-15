import Database from "./database/mysql";

export class Products {
  constructor () {
    this.db = new Database();
  }

  async getProductIdByReference (reference) {
    const query =`
      SELECT id
      FROM products
      WHERE 
        prd_referencia = ? AND
        excluido = 0
    `
    try {
      const id = await this.db.query(query, [reference]);
      return id[0];
    } catch (error) {
      console.error('Erro ao buscar produto por referência:', error);
      throw error;
    }
  }

  async updateManyStocks (productsStocks) {
    console.log('----------PEGANDO IDS DOS PRODUTOS----------')
    const productsIds = await Promise.all(productsStocks.map(async ({ reference }) => {
      const productId = await this.getProductIdByReference(reference);
      return productId;
    }));

    const productsIdsStocks = productsIds.map((productId, index) => ({
      productId,
      stock: productsStocks[index].stock
    })); 

    console.log('----------ATUALIZANDO ESTOQUES----------')
    const promises = productsIdsStocks.map(async ({ productId, stock }, i) => {
      await this.updateStock(productId, stock);
      console.log(`Estoque do produto ${productId} atualizado para ${stock} - ${i} de ${productsIdsStocks.length}`)
    });

    try {
      await Promise.all(promises);
      console.log('----------ESTOQUES ATUALIZADOS----------')
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
    `
    const values = [stock, productId];

    try {
      await this.db.query(query, values);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }
 
}