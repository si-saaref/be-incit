const express = require('express');
const { signUp, signIn } = require('./controller');
const router = express.Router();

/* GET home page. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

module.exports = router;
