const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, downloadFile, deleteFile } = require('../controllers/file.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// @route   POST /api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', protect, upload.single('file'), uploadFile);

// @route   GET /api/files
// @desc    Get all files for a user
// @access  Private
router.get('/', protect, getFiles);

// @route   GET /api/files/download/:id
// @desc    Download a file
// @access  Private
router.get('/download/:id', protect, downloadFile);

// @route   DELETE /api/files/:id
// @desc    Delete a file
// @access  Private
router.delete('/:id', protect, deleteFile);

module.exports = router;
