const ws = require('ws');
const express = require('express');

const CategoryService = require('./services/CategoryService')
const ProductService = require('./services/ProductService')
const OrderService = require('./services/OrderService');
const products = require('./database/Products');

require('dotenv').config();
PORT = process.env.PORT || 3333;

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

const wss = new ws.Server({ server });

const introMessage = `
Olá, para visualizar o os produtos disponíveis envie: "catalogo".</br>
Para adicionar opções ao pedido envie: 
"adicionar opção quantidade".</br>
Por exemplo: "adicionar laranja 4"</br>
Para visualizar seu pedido envie: 
"pedido"</br>
Para remover um produto do seu pedido envie: 
"remover opção"</br>
Para limpar o pedido envie: 
"limpar"</br>
Para finalizar o pedido envie:
"finalizar" 
`;

wss.on("connection", async (socket) => {
    socket.send(introMessage);
    socket.on("message", (message) => {
      
      let answer = message.toString().split(" ");

      if (answer[0] == "catalogo") {
        socket.send(showProducts());
      } else if (answer[0] == "adicionar") {    
        if (answer.length >= 3) {
          if (checkIfProductCanBeAdded(answer[1])[0]) {
            OrderService.addProduct(checkIfProductCanBeAdded(answer[1])[1].id, answer[2])
            socket.send("Produto adicionado com sucesso")
          } else {
            socket.send("Algo deu errado, tente novamente")
          }
        }
      } else if (answer[0] == "remover") {
        if (answer.length >= 2) {
          if (checkIfProductCanBeRemoved(answer[1])[0]) {
            OrderService.deleteProduct(checkIfProductCanBeRemoved(answer[1])[1].id, answer[1].description)
            socket.send("Produto removido com sucesso")
          } else {
            socket.send("Algo deu errado, tente novamente")
          }
        }
      } else if (message == "pedido") {
        showOrder(socket)
      }
      else if (message == "limpar") {
        clearOrder(socket)
      }
      else if (message == "finalizar") {
        checkIfCanDoCheckout(socket)
      }
      else {
        socket.send("comando não encontrado")
      }
    });
});

function checkIfProductCanBeAdded(productName) {
  let result;
  let productToBeReturned;
  products.products.find(product => {
    if (product.description.toLowerCase() === productName) {
      result = true
      productToBeReturned = product
    }
    return;
  })
  return [result, productToBeReturned]
}

function checkIfProductCanBeRemoved(productName) {
  let result;
  let productToBeReturned;
  products.products.find(product => {
    if (product.description.toLowerCase() === productName) {
      result = true
      productToBeReturned = product
    }
    return;
  })
  return [result, productToBeReturned]
}

function showProducts() {
  return `<h2> Frutas </h2>
  Banana: R$ 0,50</br>
  Laranja: R$ 1,00</br>
  <h2> Bebidas </h2>
  Coca Cola': R$ 5,00</br>
  Leite: R$ 3,00</br>
  Agua: R$ 2,00</br>
  <h2> Pereciveis </h2>
  Sal: R$ 1,00</br>
  Açucar: R$ 2,00</br>
  Macarrão: R$ 6,00</br>
  <h2> Frios </h2>
  Bisteca: R$ 40,00</br>
  Frango: R$ 21,00</br>`
}

function showOrder(socket) {
  let order = OrderService.getOrder()
  socket.send(JSON.stringify(order))
}

function clearOrder(socket) {
  OrderService.clearOrder()
  socket.send("Pedido cancelado")
}

function checkIfCanDoCheckout(socket) {
  let order = OrderService.getOrder()
  if (order.products.length >= 1) {
    socket.send("Pedido finalizado com sucesso")
  } else {
    socket.send("Seu carrinho está vazio, adicione algo antes de finalizar")
  }
}
