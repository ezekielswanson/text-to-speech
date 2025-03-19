const File = require('../model/fileModel');
const textExtractor = require('../services/textExtractor');
// Note: We're removing the translationService import since we'll use the API directly

// Controller for uploading a file
exports.uploadFile = async (req, res) => {
  try {
    // Check if a file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from the file
    let textContent = '';
    try {
      textContent = await textExtractor.extractText(
        req.file.buffer, 
        req.file.mimetype,
        req.file.originalname
      );
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      // Continue with upload even if text extraction fails
    }

    // Create a new file document
    const newFile = new File({
      filename: req.file.filename || req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer, // This is the file buffer from multer's memoryStorage
      textContent: textContent,
      translatedContent: new Map()
    });

    // Save the file to MongoDB
    await newFile.save();

    // Return success response
    res.status(201).json({
      message: 'File uploaded successfully',
      fileId: newFile._id,
      filename: newFile.originalname,
      hasTextContent: !!textContent
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Controller for retrieving a file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set the appropriate content type
    res.set('Content-Type', file.mimetype);
    
    // Send the file data
    res.send(file.data);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file', error: error.message });
  }
};

// Controller for listing all files
exports.getAllFiles = async (req, res) => {
  try {
    // Find all files but don't include the binary data
    const files = await File.find({}, { data: 0 });
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
};

// Controller for translating file content
// THIS IS THE UPDATED METHOD THAT USES THE EXISTING API ENDPOINT
exports.translateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetLanguage } = req.body;

    if (!targetLanguage) {
      return res.status(400).json({ message: 'Target language is required' });
    }

    // Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if we have text content to translate
    if (!file.textContent) {
      return res.status(400).json({ message: 'No text content available for translation' });
    }

    // Check if we already have this translation
    if (file.translatedContent.get(targetLanguage)) {
      return res.json({
        message: 'Translation already exists',
        translation: file.translatedContent.get(targetLanguage)
      });
    }
    
    // Use the existing translate API endpoint
    const apiUrl = `${req.protocol}://${req.get('host')}/api/translate`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: file.textContent,
        target: targetLanguage
      })
    });
    
    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }
    
    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    // Save the translation
    file.translatedContent.set(targetLanguage, translatedText);
    await file.save();

    // Return the translation
    res.json({
      message: 'Translation successful',
      targetLanguage,
      translation: translatedText
    });
  } catch (error) {
    console.error('Error translating file:', error);
    res.status(500).json({ message: 'Error translating file', error: error.message });
  }
};

// Controller for retrieving a file's translation
exports.getFileTranslation = async (req, res) => {
  try {
    const { id, language } = req.params;

    // Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if we have the requested translation
    if (!file.translatedContent.get(language)) {
      return res.status(404).json({ message: 'Translation not found for this language' });
    }

    // Return the translation
    res.json({
      fileId: file._id,
      filename: file.originalname,
      language,
      translation: file.translatedContent.get(language)
    });
  } catch (error) {
    console.error('Error retrieving translation:', error);
    res.status(500).json({ message: 'Error retrieving translation', error: error.message });
  }
};

// Controller for getting the text content of a file
exports.getFileTextContent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if we have text content
    if (!file.textContent) {
      return res.status(404).json({ message: 'No text content available for this file' });
    }

    // Return the text content
    res.json({
      fileId: file._id,
      filename: file.originalname,
      textContent: file.textContent
    });
  } catch (error) {
    console.error('Error retrieving text content:', error);
    res.status(500).json({ message: 'Error retrieving text content', error: error.message });
  }
};

// Controller for getting available translations for a file
exports.getAvailableTranslations = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the file
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Get available languages
    const availableLanguages = Array.from(file.translatedContent.keys());

    // Return the available languages
    res.json({
      fileId: file._id,
      filename: file.originalname,
      availableLanguages
    });
  } catch (error) {
    console.error('Error retrieving available translations:', error);
    res.status(500).json({ message: 'Error retrieving available translations', error: error.message });
  }
};