const express = require('express');

const userController = require('../controllers/user');
const token = require('../middleware/token');

const router = express.Router();

router.get('/users', token, userController.getUsers);
router.post('/messages', token, userController.getUserMessages);

module.exports = router;
