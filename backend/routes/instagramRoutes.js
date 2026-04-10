const express = require('express');
const router = express.Router();
const { analyzeInstagram, healthCheck } = require('../controllers/instagramController');

router.get('/health', healthCheck);
router.post('/analyze', analyzeInstagram);

module.exports = router;