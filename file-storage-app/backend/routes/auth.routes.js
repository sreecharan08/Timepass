const express = require('express');
const router = express.Router();
const { googleSignIn } = require('../controllers/auth.controller');

// @route   POST /api/auth/google
// @desc    Authenticate user with Google
// @access  Public
router.post('/google', googleSignIn);

module.exports = router;
