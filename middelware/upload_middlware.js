const multer = require('multer');

// Set up multer storage - using memory storage for file processing
const storage = multer.memoryStorage();

// Create multer upload instance with 5MB file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    if (
      file.mimetype === 'text/plain' || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only TXT, PDF, DOC, and DOCX files are allowed'), false);
    }
  }
});

module.exports = upload;