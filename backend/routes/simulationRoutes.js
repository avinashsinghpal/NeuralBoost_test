const express = require('express');
const { sendSimulation, trackToken, phishedLanding, testSMTP, getPhished, getAllPhishedDetails, getTemplateOptions } = require('../controllers/simulationController');

const router = express.Router();

router.post('/send', sendSimulation);
router.get('/test-smtp', testSMTP);
router.get('/phished', getPhished);
router.get('/phished/all', getAllPhishedDetails);
router.get('/template-options/:type', getTemplateOptions);

// Tracking endpoints
router.get('/track/:token', trackToken);

module.exports = router;


