db.createUser({
    user: 'admin',
    pwd: 'secure_password',
    roles: [
        {
            role: 'readWrite',
            db: 'ai_blockchain_hub'
        }
    ]
});

db.createCollection('users');
db.createCollection('votes');
db.createCollection('proposals');
db.createCollection('transactions');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.votes.createIndex({ "proposal": 1, "voter": 1 }, { unique: true });
db.proposals.createIndex({ "status": 1, "startDate": 1, "endDate": 1 });
db.transactions.createIndex({ "blockchainTxHash": 1 }, { unique: true, sparse: true }); 