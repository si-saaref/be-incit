const express = require('express');
const { isLoginUser } = require('../middleware/auth');
const { listUser, summary } = require('../dashboard/controller');
const router = express.Router();

/* GET home page. */
router.get('/list-user', isLoginUser, listUser);
router.get('/summary', isLoginUser, summary);

module.exports = router;
