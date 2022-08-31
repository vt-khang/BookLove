// Import
const express = require('express');

// Global variables
const router = express.Router();
const HomeController = require('../controllers/HomeController');

// [GET] /search
router.get('/search', HomeController.search);
// [POST] /search
router.post('/search', HomeController.filter);
// [POST] /feedback
router.post('/feedback', HomeController.feedback);
// [GET] /logout
router.get('/log-out', HomeController.logout);
// [GET] /
router.get('/', HomeController.index);

// Export
module.exports = router;
