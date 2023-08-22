const express = require(`express`);
const fs = require("fs");
const { ProductManager, Product } = require("./ProductManager.js");
const { pid } = require("process");

const app = express();
app.use(express.urlencoded({ extended: true }));

const pm = new ProductManager();
app.get("/products", (req, res) => {
  const productos = pm.getProducts();
  if (req.query.limit) {
    return res.send(productos.slice(0, req.query.limit));
  }
  return res.send(productos);
});

app.get("/products/:pid", (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const productos = pm.getProducts();
  p = productos.find((pro) => pro.id === pid);
  if (p) {
    return res.send(p);
  } else {
    return res.status(404).send(`NOT FOUND`);
  }
});

app.listen(8080, () => console.log("Server corriendo"));
