const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const proposalController = require('../controllers/proposalController');

const router = express.Router();

router.get('/', proposalController.getAllProposals);
router.get('/:id', proposalController.getProposal);

// Protected routes
router.use(authenticate);

router.post('/', authorize(['admin', 'analyst']), proposalController.createProposal);
router.put('/:id', authorize(['admin', 'analyst']), proposalController.updateProposal);
router.delete('/:id', authorize(['admin']), proposalController.deleteProposal);
router.post('/:id/status', authorize(['admin']), proposalController.updateStatus);

module.exports = router; 