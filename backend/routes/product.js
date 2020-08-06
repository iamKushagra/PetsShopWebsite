const express = require('express')
const router = express.Router()

const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, listSearch, photo} = require('../controllers/product')
const {requireSignIn, isAdmin, isAuth} = require('../controllers/auth')
const {userById} = require('../controllers/user')


router.post("/products/by/search", listBySearch)
router.get('/product/photo/:productId', photo)
router.post('/product/create/:userId', requireSignIn,isAuth, isAdmin, create)
router.get('/product/:productId', requireSignIn, read)
router.delete('/product/:productId/:userId', requireSignIn,isAuth, isAdmin, remove)
router.put('/product/:productId/:userId', requireSignIn,isAuth, isAdmin, update)
router.get('/products', list)
router.get("/products/search", listSearch)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
// parameter - handlers
router.param('userId', userById)
router.param('productId', productById)

module.exports = router