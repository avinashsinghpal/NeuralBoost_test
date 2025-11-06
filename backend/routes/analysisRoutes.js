const express = require('express');
const { getAnalysis, postAnalyze, postAnalyzeEmail } = require('../controllers/analysisController');

const router = express.Router();

router.get('/', getAnalysis);
router.post('/', postAnalyze);
router.post('/email', postAnalyzeEmail);

module.exports = router;
