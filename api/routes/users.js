const express = require('express');
const router = express.Router();

const jwtTokenValidation = require('../config/jwtTokenValidation');

const userController = require('../controllers/users');

// const signupFun = (req, res, next) => {
//     return res.status(201).json({message:'done user creation'});
// }

router.post('/signup', userController.signup_user);

router.post('/login', userController.login_user);

router.delete('/', jwtTokenValidation, userController.delete_user);


module.exports = router;