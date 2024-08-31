const express = require('express');
const { upload, uploadCSV } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadCSV);

module.exports = router;
