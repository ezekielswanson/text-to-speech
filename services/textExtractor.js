const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class TextExtractor {
  async extractText(buffer, mimetype, filename) {
    try {
      // Check file extension for more accurate type detection
      const fileExtension = filename.split('.').pop().toLowerCase();
      
      if (mimetype === 'text/plain' || fileExtension === 'txt') {
        // For .txt files
        return buffer.toString('utf-8');
      } 
      else if (mimetype === 'application/pdf' || fileExtension === 'pdf') {
        // For .pdf files
        const data = await pdfParse(buffer);
        return data.text;
      }
      else if (
        mimetype === 'application/msword' || 
        fileExtension === 'doc' ||
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileExtension === 'docx'
      ) {
        // For .doc and .docx files
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      }
      else {
        throw new Error(`Unsupported file type: ${mimetype} (${filename})`);
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  }
}

module.exports = new TextExtractor();