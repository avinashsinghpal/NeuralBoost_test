const express = require('express');
const { askChatbot } = require('../controllers/chatController');

const router = express.Router();

router.post('/ask', askChatbot);

module.exports = router;


