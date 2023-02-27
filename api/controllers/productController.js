const { validationResult } = require('express-validator')
const { checkExistingUser, getUserById } = require('../utils/userUtils')
const { addNewProduct, getProductById, deleteProductFromDB, checkExistingSku, updateProductById } = require('../utils/productUtils')
const bcrypt = require('bcryptjs')
const awssdk = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
const dotenv = require('dotenv')

dotenv.config()
const s3 = new awssdk.S3({apiVersion: "2006-03-01"})

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

        setSuccessResponse(newProduct, res, 201)
    } catch (e) {
        errorHandler(e.message, res)
    }
}

const getProduct = async (req, res) => {
    try {
        const id = req.params.id
        const productById = await getProductById(id)
        if (productById == null) return errorHandler(`Product by this id does not exists`, res, 404)

        const productData = productById.toJSON()

        setSuccessResponse(productData, res)
    } catch (e) {
        errorHandler(e.message, res)
    }
}

const updateProduct = async (req, res) => {
    try {
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
        errorHandler(e.message, res)
    }
}

const updateProductPatch = async (req, res) => {
    try {
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
        errorHandler(e.message, res)
    }
}


const deleteProduct = async (req, res) => {
    try {
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
        errorHandler(e.message, res)
    }
}

const getAllImagesForProduct = async (req, res) => {
    try {
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
        
    } catch (error) {
       errorHandler(error.message, res) 
    }
}

const addImage = async (req, res) => {
    try {
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

        const fileTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg'
        ]

        const upload = multer({
            storage: multerS3({
              s3: s3,
              bucket: process.env.AWS_BUCKET_NAME,
              acl: 'private',
              metadata: function (req, file, cb) {
                cb(null, { product_id: req.params.product_id })
              },
              key: function (req, file, cb) {
                path = `${process.env.AWS_BUCKET_NAME}/${existingUser.id}/${Date.now().toString()}-${file.originalname}`
                cb(null, path)
              },
            }),
            fileFilter: (req, file, cb) => {
                if (!fileTypes.includes(file.mimetype))
                    return cb(new Error('File type is not valid'))
                cb(null, true)
            }
          })
          .single('imagefile')

        await upload(req, res, async err => {
            if (err) return errorHandler(`Only JPEG, JPG and PNG format accepted`, res, 400)
    
            if (req.file) {
                const imgData = {
                    file_name: req.file.originalname,
                    product_id: id,
                    s3_bucket_path: req.file.location
                }
                let productImg
                let productImageData = await saveProductImg(imgData)
                    .then(function(data) {
                        productImg = data.toJSON()
                        setSuccessResponse(productImg, res, 201)
                    })
                    .catch(error => {
                        return errorHandler(error.message, res, 400)
                    });
            } else {
                return errorHandler(`File is not selected`, res, 400)
            }
        })

    } catch (error) {
        errorHandler(error.message, res)
    }
}

const getImageByProductId = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const deleteImageByProductId = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { addProduct, getProduct, updateProduct, updateProductPatch, deleteProduct, getAllImagesForProduct, addImage, getImageByProductId, deleteImageByProductId }