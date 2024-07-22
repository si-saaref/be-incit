const express = require('express');
const { signUp, signIn, signOut, editUser, editPassword, verifyEmail } = require('./controller');
const { isLoginUser } = require('../middleware/auth');
const router = express.Router();

/* GET home page. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.put('/edit-user', isLoginUser, editUser);
router.put('/edit-password', isLoginUser, editPassword);
router.get('/verify-email/:id/:token', verifyEmail);

module.exports = router;
