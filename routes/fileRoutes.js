const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileControllers');
const upload = require('../middelware/upload_middlware');

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:id', fileController.getFileById);
router.get('/', fileController.getAllFiles);

// New routes for text extraction and translation
router.get('/:id/text', fileController.getFileTextContent);
router.post('/:id/translate', fileController.translateFile);
router.get('/:id/translation/:language', fileController.getFileTranslation);

// Add routes for getting translations (optional, based on your controller)
router.get('/:id/translate/:language', fileController.getFileTranslation);
router.get('/:id/translations', fileController.getAvailableTranslations);

module.exports = router;
