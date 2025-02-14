const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const voteController = require('../controllers/voteController');

const router = express.Router();

router.use(authenticate); // All vote routes require authentication

router.post('/', voteController.castVote);
router.get('/user/:userId', voteController.getUserVotes);
router.get('/proposal/:proposalId', voteController.getProposalVotes);
router.get('/stats/proposal/:proposalId', voteController.getVoteStats);
router.get('/verify/:voteId', voteController.verifyVote);

module.exports = router; 