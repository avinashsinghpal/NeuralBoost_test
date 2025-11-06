const express = require('express');
const { getAwareness } = require('../controllers/awarenessController');

const router = express.Router();

router.get('/', getAwareness);

module.exports = router;
