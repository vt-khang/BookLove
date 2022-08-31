// Import
const express = require('express');

// Global variables
const router = express.Router();
const SignupController = require('../controllers/SignupController');

// [GET] /
router.get('/', SignupController.index);
// [POST] /
router.post('/', SignupController.create);

// Export
module.exports = router;
