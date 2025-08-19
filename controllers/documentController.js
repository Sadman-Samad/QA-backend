const Document = require('../models/Document');
const { processDocument } = require('../services/documentProcessor');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.document;
    const { text, chunks } = await processDocument(file.data, file.name);

    const document = new Document({
      filename: file.name,
      originalText: text,
      chunks,
      createdAt: new Date()
    });

    await document.save();

    res.json({ 
      message: 'File processed successfully',
      documentId: document._id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing document' });
  }
};