const Document = require('../models/Document');
const { queryDocument } = require('../services/aiService');

exports.queryDocument = async (req, res) => {
  try {
    const { documentId, question } = req.body;
    
    if (!documentId || !question) {
      return res.status(400).json({ error: 'Document ID and question are required' });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const answer = await queryDocument(document.chunks, question);
    
    document.qaHistory.push({ question, answer });
    await document.save();

    res.json({ answer });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Error processing query' });
  }
};