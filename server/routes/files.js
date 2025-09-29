const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth.middleware');
const File = require('../models/file.model');
const User = require('../models/user.model');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/${req.user.userId}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, TXT, and DOC/DOCX files are allowed.'));
    }
  }
}).single('file');

// @route   POST /files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }
    if (req.file == undefined) {
      return res.status(400).json({ msg: 'Error: No File Selected!' });
    }

    const { originalname, filename, size, mimetype } = req.file;

    const newFile = new File({
      user: req.user.userId,
      originalName: originalname,
      storageName: filename,
      size: size,
      mimeType: mimetype,
    });

    try {
      const savedFile = await newFile.save();
      res.json(savedFile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
});

// @route   GET /files
// @desc    Get all files for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.userId });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route   GET /files/download/:id
// @desc    Download a file
// @access  Private
router.get('/download/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }
    if (file.user.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const filePath = path.join(__dirname, `../../uploads/${req.user.userId}`, file.storageName);
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /files/:id
// @desc    Delete a file
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }
    if (file.user.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const filePath = path.join(__dirname, `../../uploads/${req.user.userId}`, file.storageName);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      await file.deleteOne();
      res.json({ msg: 'File deleted' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


module.exports = router;