const { categories } = require('../database/Categories')

class CategoryService {
  static listCategories() {
    return categories
  }
}

module.exports = CategoryService