const { products } = require('../database/Products')
const { order } = require('../database/Orders')


class OrderService {
  static addProduct(productId, qty) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === productId) {
        products[i].stock -= qty
        order.products.push({
          product: products[i].description,
          qty,
          price: qty * products[i].price
        })
        order.totalPrice += qty * products[i].price
      }
    }
  }

  static getOrder() {
    return order
  }

  static deleteProduct(productId) {
    order.totalPrice -= order.products[productId].price
    order.products.splice(productId, 1)
    return order
  }

  static clearOrder() {
    order.totalPrice = 0
    order.products.splice(0, order.products.length)
  }
}

module.exports = OrderService