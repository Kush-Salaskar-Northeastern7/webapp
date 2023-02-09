const Product = require('../models/products')


//Creating a new Product
const addNewProduct = async (user) => {
    return await Product.create(user)
}

const getProductById = async (id) => {
    try {
        const product = await Product.findOne({
            where: {
              id: id
            }
          })
        return product
    } catch (error) {
        return null
    }
}

const checkExistingSku = async (sku) => {
  return await Product.findOne({ where: { sku: sku } })
}

const updateProductById = async (id, currProduct) => {

    return await Product.update({
        date_last_updated: new Date(),
        name: currProduct.name,
        description: currProduct.description,
        sku: currProduct.sku,
        manufacturer: currProduct.manufacturer,
        quantity: currProduct.quantity
      }, {
        where: {
          id: id
        }
      })
}

const deleteProductFromDB = async (product) => {
    try {
        await product.destroy()
        return true
    } catch (error) {
        return false
    }
}

module.exports = { addNewProduct, getProductById, updateProductById, checkExistingSku, deleteProductFromDB }