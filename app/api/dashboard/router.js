const express = require('express');
const { isLoginUser } = require('../middleware/auth');
const { listUser } = require('../dashboard/controller');
const router = express.Router();

/* GET home page. */
router.get('/list-user', isLoginUser, listUser);

module.exports = router;
