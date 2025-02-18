const express = require('express');
const router = express.Router();
const politicalNewsController = require('../controllers/politicalNewsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/news', politicalNewsController.getNews);
router.get('/news/:id', politicalNewsController.getNewsById);
router.get('/analysis/:newsId', politicalNewsController.getAnalysis);
router.get('/impact-report', politicalNewsController.getImpactReport);
router.get('/trends', politicalNewsController.getTrends);

// Admin routes
router.use(authenticate);
router.use(authorize(['admin', 'analyst']));
router.post('/news', politicalNewsController.createNews);
router.put('/news/:id', politicalNewsController.updateNews);
router.delete('/news/:id', politicalNewsController.deleteNews);

module.exports = router; 