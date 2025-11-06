const express = require('express');
const { getChannels } = require('../controllers/channelController');

const router = express.Router();

router.get('/', getChannels);

module.exports = router;
