const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const uuid = require('uuid')

router.post('/crypto-return', (req, res)=>{

  const {string} = req.body
  
  const md5Hash = crypto.createHash('md5')
    .update(string)
    .digest('hex')

  const secret = 'this is the secret'
  const salt = uuid.v1()
  const key = crypto.scryptSync(secret, 'salt', 24)
  const savedSalt = "fa21a600-a303-11ea-bbc7-b9488f949a50"
  const sha256 = crypto.createHmac('sha256', savedSalt)
    .update(string)
    .digest('hex')

  const {privateKey, publicKey} = crypto.generateKeyPairSync('ec', {
    namedCurve: 'sect239k1'
  })
  const sign = crypto.createSign('SHA256')
  sign.write(secret)
  sign.end()

  const signature = sign.sign(privateKey, 'hex')

  const verify = crypto.createVerify('SHA256')
  verify.write(secret)
  verify.end()

  const verified = verify.verify(publicKey, signature, 'hex')


  const cipher = crypto.createCipher('aes-192-gcm', key)
  


  res.json({
    "md5": md5Hash,
    "sha256": sha256,
    "salt": salt,
    "signature": signature,
    "verified": verified 
  })


})

module.exports = router