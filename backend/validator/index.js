const {check} = require('express-validator');


exports.userSignupValidator = (req, res, next)=>{
  
  req.check('name', 'Name is required').notEmpty()
  req.check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @ and must be valid')
    .isLength({
      min: 4,
      max: 32
    })
  req.check('password', 'Password is required').notEmpty()
  req.check('password')
    .isLength({min: 6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number')
  const errors = req.validationErrors()
  if(errors){
    const firstError = errors.map(error=>error.msg)[0]
    console.log('firstError: ',firstError)
    console.log('errors: ',errors)
    return res.status(400).json({error: firstError})
  }
  next()

}

exports.validLogin = (req, res, next) => {
  req.check('email')
  .isEmail()
  .withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password').isLength({
      min: 6
  }).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('password must contain a number')
  const errors = req.validationErrors()
if(errors){
    const firstError = errors.map(error=>error.msg)[0]
    console.log('firstError: ',firstError)
    console.log('errors: ',errors)
    return res.status(400).json({error: firstError})
  }
  next();
}

exports.forgotPasswordValidator = (req, res, next) => {
  req.check('email')
      .not()
      .isEmpty()
      .isEmail()
      .withMessage('Must be a valid email address')
      const errors = req.validationErrors()
      if(errors){
        const firstError = errors.map(error=>error.msg)[0]
        console.log('firstError: ',firstError)
        console.log('errors: ',errors)
        return res.status(400).json({error: firstError})
      }
      next();
};

exports.resetPasswordValidator = (req, res, next) => {
  req.check('newPassword')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage('Password must be at least  6 characters long')
      const errors = req.validationErrors()
      if(errors){
        const firstError = errors.map(error=>error.msg)[0]
        console.log('firstError: ',firstError)
        console.log('errors: ',errors)
        return res.status(400).json({error: firstError})
      }
      next();
};



