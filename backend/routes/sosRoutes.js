const express = require('express');
const { triggerSOS, getSOSState } = require('../controllers/sosController');

const router = express.Router();

router.post('/trigger', triggerSOS);
router.get('/state', getSOSState);

module.exports = router;
