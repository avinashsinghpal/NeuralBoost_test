const express = require('express');
const { triggerSOS } = require('../controllers/sosController');

const router = express.Router();

router.post('/trigger', triggerSOS);

module.exports = router;
