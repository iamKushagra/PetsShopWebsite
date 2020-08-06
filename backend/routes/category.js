const express = require('express')
const router = express.Router()
const {create, categoryById, read, update, remove, list} = require('../controllers/category')
const {requireSignIn, isAdmin, isAuth} = require('../controllers/auth')
const {userById} = require('../controllers/user')

router.post('/category/create/:userId', requireSignIn,isAuth, isAdmin, create)
router.get('/category/:categoryId', read)
router.get('/category', list)
router.put('/category/:categoryId/:userId', update)
router.delete('/category/:categoryId/:userId', remove)


router.param('categoryId', categoryById)
router.param('userId', userById)

module.exports = router