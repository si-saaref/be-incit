const express = require('express');
const {
	signUp,
	signIn,
	signOut,
	editUser,
	editPassword,
	verifyEmail,
	getDetailUser,
} = require('./controller');
const { isLoginUser } = require('../middleware/auth');
const router = express.Router();

/* GET home page. */
router.get('/', isLoginUser, getDetailUser);
router.put('/edit-user', isLoginUser, editUser);
router.put('/edit-password', isLoginUser, editPassword);

module.exports = router;
