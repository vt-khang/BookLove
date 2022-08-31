// Import
const express = require('express');

// Global variables
const router = express.Router();
const LoginController = require('../controllers/LoginController');

// [GET] /
router.get('/', LoginController.index);
// [POST] /
router.post('/', LoginController.login);

// Export
module.exports = router;
