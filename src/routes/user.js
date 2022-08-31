// Import
const express = require('express');

// Global variables
const router = express.Router();
const UserController = require('../controllers/UserController');

// [PUT] /password/change
router.put('/password/change', UserController.change);
// [GET] /password/change
router.get('/password', UserController.password);
// [PUT] /profile/change
router.put('/profile/change', UserController.profile);
// [GET] /profile
router.get('/profile', UserController.show);
// [PUT] /bill/:slug/:n
router.put('/bill/:slug/:n', UserController.update);
// [DELETE] /bill/:slug
router.delete('/bill/:slug', UserController.delete);
// [POST] /bill/pay
router.post('/bill/pay', UserController.pay);
// [GET] /bill
router.get('/bill', UserController.index);
// [DELETE] /bill
router.delete('/bill', UserController.destroy);

// Export
module.exports = router;
