const express = require('express');
const providerController = require('../controllers/providerController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(
  authMiddleware.authenticate,
  authMiddleware.providerRoleAuthenticate
);

router.post('/services', providerController.createService);

module.exports = router;