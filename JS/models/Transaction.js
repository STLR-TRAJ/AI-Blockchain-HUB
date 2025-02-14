const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['vote', 'proposal', 'financial'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: function() {
            return this.type === 'financial';
        }
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    blockchainTxHash: String,
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'referenceModel'
    },
    referenceModel: {
        type: String,
        enum: ['Vote', 'Proposal', 'Financial']
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        location: String
    }
}, {
    timestamps: true
});

// Indexes
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ blockchainTxHash: 1 }, { unique: true, sparse: true });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 