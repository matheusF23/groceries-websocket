const ws = require('ws');
const express = require('express');

const CategoryService = require('./services/CategoryService')
const ProductService = require('./services/ProductService')
const OrderService = require('./services/OrderService');

require('dotenv').config();
PORT = process.env.PORT || 3333;

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

const wss = new ws.Server({ server });

wss.on("connection", (socket) => {
    console.log("Conexão estabelecida...");

    socket.on("message", (message) => {
        if (message == "categoria") {
          socket.send("Seja bem vindo(a) ao mercadinho SD");
          socket.send('\nEscolha o número da categoria:');
          
          const categories = JSON.parse(JSON.stringify(CategoryService.listCategories()));
          const categoryKeys = Object.keys(categories);
          
          categoryKeys.forEach(key => {
            socket.send(`${key}: ${categories[key]}`)
          })
          if (message == "1" ) {
            getProductsByCategory('Frutas')
            categoryKeys.forEach(key => {
              socket.send(`${key}: ${categories[key]}`)
            })
          } else if (message == "2" ) {
            getProductsByCategory('Bebidas')
            categoryKeys.forEach(key => {
              socket.send(`${key}: ${categories[key]}`)
            })
          } else if (message == "3" ) {
            getProductsByCategory('Perecíveis')
            categoryKeys.forEach(key => {
              socket.send(`${key}: ${categories[key]}`)
            })
          } else if (message == "4" ) {
            getProductsByCategory('Frios')
            categoryKeys.forEach(key => {
              socket.send(`${key}: ${categories[key]}`)
            })
          }
        } 
    });
});

function getProductsByCategory(category) {
  const categories = JSON.parse(JSON.stringify(ProductService.getProductsByCategory(category)));
  const categoryKeys = Object.keys(categories);
}