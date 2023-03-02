const Product = require('../models/products')
const Image = require('../models/image')


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

const saveProductImg = async (imgData) => {
  return await Image.create(imgData)
}

const getImagesByProductId = async (productId) => {
  const images = await Image.findAll({
    where: {
      product_id: productId,
    },
  });
  return images.map((image) => image.toJSON());
};

const getImageById = async (imageId, productId) => {
  const image = await Image.findOne({
    where: {
      image_id: imageId,
      product_id: productId,
    },
  });
  if (!image) {
    return false
  }
  return image.toJSON();
};

const deleteImageById = async (imageId, productId) => {
  const image = await Image.findOne({
    where: {
      image_id: imageId,
      product_id: productId,
    },
  });
  if (!image) {
    return false
  }
  await image.destroy();
  return true
};

module.exports = { addNewProduct, getProductById, updateProductById, checkExistingSku, deleteProductFromDB, saveProductImg, getImagesByProductId, getImageById, deleteImageById }