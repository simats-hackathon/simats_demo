const express = require('express');
const { getProfileAnalysis, compareProfiles, getPortfolioStats } = require('../controllers/profileController');

const router = express.Router();

router.get('/stats', getPortfolioStats);
router.get('/:username', getProfileAnalysis);
router.get('/compare/:username1/:username2', compareProfiles);

module.exports = router;