const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 20
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    category: {
        type: String,
        enum: ['governance', 'financial', 'technical', 'community'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    quorum: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    votingResults: {
        for: { type: Number, default: 0 },
        against: { type: Number, default: 0 },
        abstain: { type: Number, default: 0 }
    },
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    blockchainAddress: String,
    smartContractAddress: String
}, {
    timestamps: true
});

// Indexes
proposalSchema.index({ status: 1, startDate: 1, endDate: 1 });
proposalSchema.index({ category: 1 });
proposalSchema.index({ creator: 1 });

// Virtual for calculating total votes
proposalSchema.virtual('totalVotes').get(function() {
    return this.votingResults.for + this.votingResults.against + this.votingResults.abstain;
});

module.exports = mongoose.model('Proposal', proposalSchema); 