const express = require('express')
const router = express.Router()
const {signUp, signIn, signOut, requireSignIn} = require('../controllers/auth')
const {userSignupValidator} = require('../validator')

router.post('/signup',userSignupValidator, signUp)

router.post('/signin', signIn)

router.get('/signout', signOut)


// TEST FOR requireSignIn
/* router.get('/hello', requireSignIn, (req, res)=>{
  res.send('hello there this needs sign in.')
}) */

module.exports = router