const { validationResult } = require('express-validator')
const { checkExistingUser, getUserById } = require('../utils/userUtils')
const { addNewProduct, getProductById, deleteProductFromDB, checkExistingSku, updateProductById, saveProductImg, getImagesByProductId, getImageById, deleteImageById } = require('../utils/productUtils')
const bcrypt = require('bcryptjs')
const multer = require("multer")
const multerS3 = require("multer-s3")
const formidable = require('formidable')
const fs = require('fs')
const dotenv = require('dotenv')
const AWS = require('aws-sdk')
const statsDClient = require('statsd-client')
const sdc = new statsDClient({ host: 'localhost', port: 8125 })
const logger = require('simple-node-logger').createSimpleLogger()

dotenv.config()

const s3 = new AWS.S3({
    apiVersion: "2006-03-01"
})


//Method to handle errors
const errorHandler = (message, res, errCode=500) => {
    res.status(errCode);
    res.json({error:message});
}

//method to execute when exec is successfull
const setSuccessResponse = (data, res, successCode=200) => {
    res.status(successCode);
    res.json(data);
}

const addProduct = async (req, res) => {
    try {
        sdc.increment('POST /v1/product')
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

        // if any validation fails
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return errorHandler(validationErrors.array(), res, 400)
        }

        const existingSku = await checkExistingSku(req.body.sku)
        if (typeof existingSku === 'object' && existingSku !== null) 
            return errorHandler(`Sku already exists`, res, 400)

        const product = {...req.body, owner_user_id: existingUser.id }
        const newProduct = await addNewProduct(product)

        logger.info(newProduct)
        setSuccessResponse(newProduct, res, 201)
    } catch (e) {
        logger.error(e.message)
        errorHandler(e.message, res)
    }
}

const getProduct = async (req, res) => {
    try {
        sdc.increment('GET /v1/product/pr_id')
        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        const productData = productById.toJSON()

        logger.info(productData)
        setSuccessResponse(productData, res)
    } catch (e) {
        logger.error(e.message)
        errorHandler(e.message, res)
    }
}

const updateProduct = async (req, res) => {
    try {
        sdc.increment('PUT /v1/product/pr_id')
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to modify this resource", res, 403)

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return errorHandler(validationErrors.array(), res, 400)
        }

        const existingSku = await checkExistingSku(req.body.sku)
        if (typeof existingSku === 'object' && existingSku !== null) 
            return errorHandler(`Sku already exists`, res, 400)

        const newProduct = req.body
        
        // call the modifyUser service
        const updateProduct = await updateProductById(id, newProduct)

        setSuccessResponse('', res, 204)
    } catch (e) {
        logger.error(e.message)
        errorHandler(e.message, res)
    }
}

const updateProductPatch = async (req, res) => {
    try {
        sdc.increment('PATCH /v1/product/pr_id')
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to modify this resource", res, 403)

        if (req.body.sku !== undefined) {
            const existingSku = await checkExistingSku(req.body.sku)
            if (typeof existingSku === 'object' && existingSku !== null) 
                return errorHandler(`Sku already exists`, res, 400)
        }
        

        // in a PATCH request, we only update the fields that are provided in the request body
        const updates = req.body
        const updatedProduct = Object.assign({}, productById, updates)

        // call the modifyProduct service
        await updateProductById(id, updatedProduct)
        setSuccessResponse('', res, 204)
    } catch (e) {
        logger.error(e.message)
        errorHandler(e.message, res)
    }
}


const deleteProduct = async (req, res) => {
    try {
        sdc.increment('DELETE /v1/product/pr_id')
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to delete this resource", res, 403)

        const deleteProductById = await deleteProductFromDB(productById)

        if(deleteProductById) setSuccessResponse('', res, 204) 
    } catch (e) {
        logger.error(e.message)
        errorHandler(e.message, res)
    }
}

const getAllImagesForProduct = async (req, res) => {
    try {
               sdc.increment('GET /v1/product/pr_id/image')
               // the username and password from Basic Auth
               const requsername = req.credentials.name
               const reqpassword = req.credentials.pass
       
               // pass header username(email) to check if user exists
               const existingUser = await checkExistingUser(requsername.toLowerCase())
               if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)
       
               let isPasswordMatch = bcrypt.compareSync(
                   reqpassword,
                   existingUser.password
               );
        
               // if wrong password throw 401
               if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)
       
               const id = req.params.id
               const productById = await getProductById(id)
               if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)
       
               if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to view this resource", res, 403)
       
               const op = await getImagesByProductId(id)
               if (op.length === 0) return setSuccessResponse("No images available", res, 404)
            
               logger.info(op)
               setSuccessResponse(op, res, 200)

    } catch (error) {
       logger.error(error.message)
       errorHandler(error.message, res, 400) 
    }
}

const addImage = async (req, res) => {
    try {
        
        sdc.increment('POST /v1/product/pr_id/image')
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to add this resource", res, 403)

        const files = req.files
        if (!files) return errorHandler(`File is not selected`, res, 400)

        const params = req.files.map((file) => {
            return {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `${id}/${Date.now().toString()}-${file.originalname}`,
              Body: file.buffer,
            }
          })

          
          const uploaded = await Promise.all(params.map((param) => s3.upload(param).promise()))
          
          const imgData = {
                      file_name: files[0].originalname,
                      product_id: id,
                      s3_bucket_path: uploaded[0].Location
                    }
          const productImageData = await saveProductImg(imgData)
          const productImg = productImageData.toJSON()
          logger.info(productImg)
          setSuccessResponse(productImg, res, 201)

    } catch (error) {
        logger.error(error.message)
        errorHandler(error.message, res, 400)
    }
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});


const getImageByProductId = async (req, res) => {
    try {

        sdc.increment('GET /v1/product/pr_id/image/img_id')
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass
        
        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)
        
        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
            
        // if wrong password throw 401
        if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)
            
        const id = req.params.product_id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)
            
        if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to view this resource", res, 403)
            

        const op = await getImageById(req.params.image_id, id)
        if (!op) return setSuccessResponse("Image does not exist", res, 404)

        logger.info(op)
        setSuccessResponse(op, res, 200) 
    } catch (error) {
        logger.error(error.message)
        errorHandler(error.message, res, 400)
    }
}

const deleteImageByProductId = async (req, res) => {
    try {

        sdc.increment('DELETE /v1/product/pr_id/image/img_id')
       // the username and password from Basic Auth
       const requsername = req.credentials.name
       const reqpassword = req.credentials.pass

       // pass header username(email) to check if user exists
       const existingUser = await checkExistingUser(requsername.toLowerCase())
       if (existingUser == null) return errorHandler(`Username is incorrect`, res, 401)

       let isPasswordMatch = bcrypt.compareSync(
           reqpassword,
           existingUser.password
       );

       // if wrong password throw 401
       if (!isPasswordMatch) return errorHandler(`Credentials do not match`, res, 401)

       const id = req.params.product_id
       const productById = await getProductById(id)
       if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

       if (productById.owner_user_id !== existingUser.id) return errorHandler("You are not allowed to delete this resource", res, 403)
        
       const image = await getImageById(req.params.image_id, id)
       if (!image) return setSuccessResponse("Image does not exist", res, 404)

        const key = image.s3_bucket_path.split("/").slice(-2).join("/")
        await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
        const deleted = await deleteImageById(req.params.image_id, id)

        if (!deleted) return errorHandler("Some issue deleting the image", res, 400)

        setSuccessResponse("", res, 204)
       
    } catch (error) {
       logger.error(error.message)
       errorHandler(error.message, res, 400) 
    }
}

module.exports = { addProduct, getProduct, updateProduct, updateProductPatch, deleteProduct, getAllImagesForProduct, addImage, getImageByProductId, deleteImageByProductId, upload }