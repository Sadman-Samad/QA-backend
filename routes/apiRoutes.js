const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const queryController = require('../controllers/queryController');

router.post('/upload', documentController.uploadDocument);
router.post('/query', queryController.queryDocument);

module.exports = router;