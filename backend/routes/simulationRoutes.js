const express = require('express');
const { sendSimulation, trackToken, phishedLanding, testSMTP, getPhished, getAllPhishedDetails } = require('../controllers/simulationController');

const router = express.Router();

router.post('/send', sendSimulation);
router.get('/test-smtp', testSMTP);
router.get('/phished', getPhished);
router.get('/phished/all', getAllPhishedDetails);

// Tracking endpoints
router.get('/track/:token', trackToken);

module.exports = router;


