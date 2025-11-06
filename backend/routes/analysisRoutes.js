const express = require('express');
const { getAnalysis, postAnalyze } = require('../controllers/analysisController');

const router = express.Router();

router.get('/', getAnalysis);
router.post('/', postAnalyze);

module.exports = router;
