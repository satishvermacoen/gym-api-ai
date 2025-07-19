// main.mjs
// Note the .mjs extension, or add "type": "module" to your package.json

import { MongoClient } from 'mongodb';

// --- Configuration for your MongoDB Databases ---
// It's recommended to store these in environment variables for production.
const dbConfigs = {
    db1: {
        uri: 'mongodb://localhost:27017', // Example URI for first database
        dbName: 'gym_members_db'
    },
    db2: {
        uri: 'mongodb://localhost:27017', // Example URI for second database
        dbName: 'gym_finances_db'
    },
    // Add more database configurations as needed
    // db3: {
    //     uri: 'mongodb://another-host:27017',
    //     dbName: 'gym_classes_db'
    // }
};

// This object will hold the active database clients and connections
const connections = {};

/**
 * Establishes a connection to a specific MongoDB database based on a key.
 * @param {string} dbKey - The key of the database configuration (e.g., 'db1', 'db2').
 * @returns {Promise<Db>} A promise that resolves to the database instance.
 */
async function connectToDb(dbKey) {
    // If a connection for this key already exists, return its db instance.
    if (connections[dbKey]) {
        console.log(`Reusing existing connection to ${dbKey} (${dbConfigs[dbKey].dbName})`);
        return connections[dbKey].db;
    }

    const config = dbConfigs[dbKey];
    if (!config) {
        throw new Error(`Database configuration for key "${dbKey}" not found.`);
    }

    try {
        console.log(`Attempting to connect to ${dbKey} (${config.dbName})...`);
        const client = new MongoClient(config.uri);

        await client.connect();
        const db = client.db(config.dbName);

        // Store both the client and the db instance for reuse and proper closing.
        connections[dbKey] = { client, db };

        console.log(`Successfully connected to ${dbKey} (${config.dbName})`);
        return db;
    } catch (error) {
        console.error(`Error connecting to ${dbKey} (${config.dbName}):`, error);
        // Exit the process if a critical database connection fails.
        process.exit(1);
    }
}

/**
 * Closes all active MongoDB connections.
 */
async function closeAllConnections() {
    console.log("Closing all database connections...");
    const closePromises = Object.values(connections).map(conn => conn.client.close());
    await Promise.all(closePromises);
    console.log("All connections closed.");
}


/**
 * The main function to demonstrate using the connections.
 */
async function main() {
    console.log("--- Starting Multi-Database Connection Demo (ES6) ---");

    try {
        // --- Connect to the first database and perform an operation ---
        const membersDb = await connectToDb('db1');
        const membersCollection = membersDb.collection('members');

        // Clean up previous runs for consistency
        await membersCollection.deleteMany({});

        // Insert a sample member
        const insertResult = await membersCollection.insertOne({
            name: 'Jane Doe',
            membershipType: 'Premium',
            joinDate: new Date()
        });
        console.log("Inserted a sample member into 'gym_members_db'.");

        // Find the member
        const member = await membersCollection.findOne({ _id: insertResult.insertedId });
        console.log("Found member:", member);


        // --- Connect to the second database and perform an operation ---
        const financesDb = await connectToDb('db2');
        const paymentsCollection = financesDb.collection('payments');
        
        // Clean up previous runs for consistency
        await paymentsCollection.deleteMany({});

        // Insert a sample payment
        await paymentsCollection.insertOne({
            memberId: member._id, // Reference the member from the other DB
            amount: 75.00,
            paymentDate: new Date(),
            type: 'Monthly Dues'
        });
        console.log("Inserted a sample payment into 'gym_finances_db'.");

        // Find the payment
        const payment = await paymentsCollection.findOne({ memberId: member._id });
        console.log("Found payment:", payment);

        // --- Demonstrate reusing a connection ---
        console.log("\nAttempting to connect to db1 again to demonstrate reuse...");
        await connectToDb('db1');


    } catch (error) {
        console.error("An error occurred in the main function:", error);
    } finally {
        // Gracefully close all connections before exiting.
        await closeAllConnections();
        console.log("\n--- Demo finished ---");
        process.exit(0);
    }
}

// Run the main function
main();
