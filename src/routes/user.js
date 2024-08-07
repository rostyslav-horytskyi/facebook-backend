const express = require('express');
const {register, activateAccount, login} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/verify', activateAccount);
router.post('/login', login);

module.exports = router;
