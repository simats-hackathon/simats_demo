const express = require('express');
const { getProfileAnalysis, compareProfiles } = require('../controllers/profileController');

const router = express.Router();

router.get('/:username', getProfileAnalysis);
router.get('/compare/:username1/:username2', compareProfiles);

module.exports = router;