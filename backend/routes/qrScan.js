// Dependencies: express, ../db/qrDb, ../services/qrAnalyzer
// Purpose: POST /api/qr/scan endpoint for QR code URL analysis

const express = require('express');
const router = express.Router();
const { getCachedResult, saveResult } = require('../db/qrDb');
const { analyzeUrl } = require('../services/qrAnalyzer');

router.post('/scan', async (req, res) => {
  try {
    const { url, user_hash } = req.body;
    
    // Validate URL
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ error: 'URL must start with http:// or https://' });
    }
    
    // Check cache first
    const cached = await getCachedResult(url);
    if (cached) {
      return res.json({
        url,
        score: cached.score,
        category: cached.category,
        reasons: cached.reasons.split('; ')
      });
    }
    
    // Analyze URL
    const result = analyzeUrl(url);
    
    // Save to database
    try {
      await saveResult(url, result.score, result.category, result.reasons, user_hash || null);
    } catch (dbErr) {
      console.error('[QR Scan] Database save error:', dbErr);
      // Continue even if save fails
    }
    
    // Return result
    res.json({
      url,
      score: result.score,
      category: result.category,
      reasons: result.reasons
    });
  } catch (error) {
    console.error('[QR Scan] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

