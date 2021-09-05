const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/users', isAuth, userController.getUsers);

module.exports = router;
