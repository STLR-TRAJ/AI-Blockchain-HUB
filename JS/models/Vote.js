const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    proposal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    },
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vote: {
        type: String,
        enum: ['for', 'against', 'abstain'],
        required: true
    },
    weight: {
        type: Number,
        default: 1
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    blockchainTxHash: String,
    signature: String,
    metadata: {
        ipAddress: String,
        userAgent: String
    }
}, {
    timestamps: true
});

// Indexes
voteSchema.index({ proposal: 1, voter: 1 }, { unique: true });
voteSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Vote', voteSchema); 