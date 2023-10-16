//import sf from 'fs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url)
const fs = require('fs')
const { title } = require('process')

class ProductManager {
  #path;
  #format;
  #products;


  constructor(path) {
    this.#path = path;
    this.#format = "utf-8";
    this.#products = [];

  }

  autoId = () => {
    if (this.#products.length === 0) {
      return 1; // Si no hay productos, el primer ID es 1
    } else {
      // Encontrar el máximo ID existente y agregar 1
      const maxId = Math.max(...this.#products.map((product) => product.id));
      return maxId + 1;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = this.autoId();
    const product = { id, title, description, price, thumbnail, code, stock };
    const codeValidate = (productCode) => productCode.code === code;
    if (this.#products.some(codeValidate)) {
      console.log("El producto ya existe");
    } else {
      this.#products.push(product);
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
      return product;
    }
  };

  getProducts = async () => {
    try {
      return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
    } catch (e) {
      console.log("Error al leer el archivo");
      return [];
    }
  };

  getProductsById = async (id) => {
    const findById = this.#products.find((product) => product.id === id);
    return findById || "Not found";
  };

  updateProduct = async (id, update) => {
    const indice = this.#products.findIndex((product) => product.id === id);
    if (indice !== -1) {
      const product = this.#products[indice];
      Object.assign(product, update);
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
      console.log("Product updated", product);
      return product;
    }
    return console.log("Error to update product. Product not found");
  };

  deleteProduct = async (id) => {
    try {
        const productIndex = this.#products.findIndex((product) => product.id === id)

        if(productIndex === -1) {
            return `Product with ID ${id} not found`
        }
        const deleteProduct = this.#products.splice(productIndex, 1)[0]

        await fs.promises.writeFile(
            this.#path, JSON.stringify(this.#products, null, '\t')
        )
        return `${deleteProduct.title}: Product deleted`
    } catch(err) {
        console.log(err)
    }
  };
}

export default ProductManager


