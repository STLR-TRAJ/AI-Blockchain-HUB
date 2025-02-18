db.createUser({
    user: process.env.MONGODB_USER,
    pwd: process.env.MONGODB_PASSWORD,
    roles: [
        {
            role: "readWrite",
            db: "ai_blockchain_hub"
        }
    ]
});

// Create collections
db = db.getSiblingDB('ai_blockchain_hub');

db.createCollection('users');
db.createCollection('financialNews');
db.createCollection('politicalNews');
db.createCollection('marketData');
db.createCollection('analysis');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.financialNews.createIndex({ "publishedDate": -1 });
db.politicalNews.createIndex({ "publishedDate": -1 });
db.marketData.createIndex({ "symbol": 1, "timestamp": -1 }); 