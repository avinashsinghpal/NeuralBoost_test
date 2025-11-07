const express = require('express');
const { login, signup, getEmployees, addEmployee } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/employees', getEmployees);
router.post('/employees', addEmployee);

module.exports = router;

