const express = require('express');
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();

const imageDirectory = path.join(__dirname, '..', 'images');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/register', upload.single('image'), authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
