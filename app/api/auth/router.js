const express = require('express');
const {
	signUp,
	signIn,
	signOut,
	verifyEmail,
	resendEmailVerification,
	signInOauth,
} = require('./controller');
const { isLoginUser } = require('../middleware/auth');
const router = express.Router();

/* GET home page. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/sign-out', isLoginUser, signOut);
router.get('/verify-email/:id/:token', verifyEmail);
router.get('/resend-email-verification/:email', resendEmailVerification);
router.post('/sign-in-oauth', signInOauth);

module.exports = router;
