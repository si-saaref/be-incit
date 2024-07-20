const express = require('express');
const { signUp, signIn, signOut } = require('./controller');
const router = express.Router();

/* GET home page. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);

module.exports = router;
