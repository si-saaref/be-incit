const express = require('express');
const { signUp, signIn, signOut, verifyEmail, resendEmailVerification } = require('./controller');
const { isLoginUser } = require('../middleware/auth');
const router = express.Router();

/* GET home page. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/verify-email/:id/:token', verifyEmail);
router.get('/resend-email-verification/:email', resendEmailVerification);

module.exports = router;
