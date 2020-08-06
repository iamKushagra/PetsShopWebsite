const express = require('express')
const router = express.Router()
const {requireSignIn, isAuth, isAdmin } = require('../controllers/auth')
const {create, getOrderById, getAllOrders, getOrderStatus, updateStatus} = require('../controllers/order')
const {addOrderToUserHistor, userById} = require('../controllers/user')
const {decreaseQuantity} = require('../controllers/product') // middlware to update the quantity in stock and keep track of the aggregate number of an item sold.



router.post('/order/create/:userId', requireSignIn, isAuth, decreaseQuantity ,addOrderToUserHistor, create)

//read
router.get(
    "/order/all/:userId",
    requireSignIn,
    isAuth,
    isAdmin,
    getAllOrders
  );
  
  //status of order
  router.get(
    "/order/status/:userId",
    requireSignIn,
    isAuth,
    getOrderStatus
  );

  //edit order
  router.put(
    "/order/:orderId/status/:userId",
    requireSignIn,
    isAuth,
    updateStatus
  );

router.param('userId', userById)
router.param("orderId", getOrderById);

module.exports = router