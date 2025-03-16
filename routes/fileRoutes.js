const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileControllers');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:id', fileController.getFileById);
router.get('/', fileController.getAllFiles);

// New routes for text extraction and translation
router.get('/:id/text', fileController.getFileTextContent);
router.post('/:id/translate', fileController.translateFile);
router.get('/:id/translation/:language', fileController.getFileTranslation);

module.exports = router;
