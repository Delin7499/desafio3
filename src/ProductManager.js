const { error, Console } = require("console");
const fs = require(`fs`);
const path = require(`path`);
const { pid } = require("process");

class Product {
  id;
  code;
  title;
  description;
  price;
  thumbnail;
  stock;

  constructor(title, description, price, thumbnail, code, stock, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = id;
  }
}

class ProductManager {
  myPath;

  constructor() {
    this.myPath = path.normalize(`./src/Products.json`);
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!fs.existsSync(this.myPath)) {
      let nuevo = new Product(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        0
      );
      let listaVacia = [];
      listaVacia.push(nuevo);
      try {
        await fs.promises.writeFile(
          this.myPath,
          JSON.stringify(listaVacia, null, `\t`)
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const productos = await fs.promises.readFile(this.myPath, `utf-8`);
        const productosObj = JSON.parse(productos);

        const p = productosObj.find((pro) => pro.code === code);

        if (p) {
          console.log(`Ya existe un producto con ese CODIGO.`);
          return;
        } else {
          const nuevo = new Product(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            productosObj.length
          );
          productosObj.push(nuevo);

          await fs.promises.writeFile(
            this.myPath,
            JSON.stringify(productosObj, null, `\t`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * Devuelve todos los productos en formato de arreglo.
   */
  getProducts() {
    let productosObj = [];
    if (fs.existsSync(this.myPath)) {
      const productos = fs.readFileSync(this.myPath, `utf-8`);
      productosObj = JSON.parse(productos);
    }
    return productosObj;
  }

  getProductById(id) {
    const productos = fs.readFileSync(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    let p = productosObj.find((p) => p.id === id);

    if (p) {
      return p;
    } else {
      return `Not Found`;
    }
  }

  async updateProduct(id, campo, value) {
    const productos = await fs.promises.readFile(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    let p = productosObj.find((p) => p.id === id);

    if (p) {
      p[campo] = value;
      await fs.promises.writeFile(
        this.myPath,
        JSON.stringify(productosObj, null, `\t`)
      );
      return;
    } else {
      console.log(`Not Found`);
      return;
    }
  }

  /**
   * Elimina producto con id deseado
   * @param id el numero de Id del producto que se desea eliminar
   */
  async deleteProduct(id) {
    const productos = await fs.promises.readFile(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    const productosFiltered = productosObj.filter((p) => p.id !== id);
    await fs.promises.writeFile(
      this.myPath,
      JSON.stringify(productosFiltered, null, `\t`)
    );
  }
}
module.exports = { ProductManager, Product };
