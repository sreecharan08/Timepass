const fs = require('fs');
const File = require('../models/file.model');

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    const { filename, path, size } = req.file;
    const user = req.user.id; // We'll get the user from the protect middleware

    const file = new File({
      filename,
      path,
      size,
      user,
    });

    await file.save();

    res.status(201).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all files for a user
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Download a file
// @route   GET /api/files/download/:id
// @access  Private
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if the user owns the file
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    res.download(file.path, file.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if the user owns the file
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Delete the actual file from the filesystem
    fs.unlinkSync(file.path);

    await file.deleteOne();

    res.json({ message: 'File removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
