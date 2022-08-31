// Import
const express = require('express');

// Global variables
const router = express.Router();
const BookController = require('../controllers/BookController');

// [GET] /:slug
router.get('/:slug', BookController.show);
// [PUT]] /:slug/buy
router.put('/:slug/buy', BookController.buy);

// Export
module.exports = router;
