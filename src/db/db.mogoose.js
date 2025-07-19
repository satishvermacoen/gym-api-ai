import mongoose from 'mongoose';
import { dbConfigs } from './constants.js';



// This object will hold the active Mongoose connection instances.
const connections = {};

const getDbConnection = async (dbKey) => {
    // 1. Reuse existing connection if available
    if (connections[dbKey]) {
        console.log(`Reusing existing connection to ${dbConfigs[dbKey].name}`);
        return connections[dbKey];
    }

    // 2. Create a new connection if none exists
    const config = dbConfigs[dbKey];
    if (!config) {
        throw new Error(`Database configuration for key "${dbKey}" not found.`);
    }

    try {
        // `mongoose.createConnection` is used for multiple connections.
        // It returns a Connection object.
        const connectionInstance = await mongoose.createConnection(config.uri).asPromise();
        
        // The `host` property is available on the connection object.
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.host} | DB NAME: ${connectionInstance.name}`);
        
        // Store the connection for reuse
        connections[dbKey] = connectionInstance;
        return connectionInstance;

    } catch (error) {
        console.log(`MONGODB connection FAILED for ${config.name}`, error);
        // Exit the process if a critical database connection fails.
        process.exit(1);
    }
};

/**
 * Closes all active Mongoose connections.
 */
const closeAllConnections = async () => {
    console.log("\nClosing all database connections...");
    const closePromises = Object.values(connections).map(conn => conn.close());
    await Promise.all(closePromises);
    console.log("All connections closed.");
};


// --- Mongoose Schemas ---
// Mongoose requires schemas to model the application data.
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    membershipType: String,
    joinDate: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
    // Use mongoose.Schema.Types.ObjectId to reference documents in other collections/DBs
    memberId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: Number,
    paymentDate: Date,
    type: String
});


/**
 * The main function to demonstrate using the Mongoose connections.
 */
async function main() {
    console.log("--- Starting Multi-Database Connection Demo (Mongoose) ---");

    try {
        // --- Get connection for the first database ---
        const membersConnection = await getDbConnection('db1');
        // Create a model ON the specific connection
        const Member = membersConnection.model('Member', memberSchema);

        // Clean up previous runs
        await Member.deleteMany({});

        // Create a new member using the model
        const newMember = await Member.create({
            name: 'Sarah Connor',
            membershipType: 'Annual'
        });
        console.log("Created a new member in 'gym_members_db':", newMember.toObject());

        // --- Get connection for the second database ---
        const financesConnection = await getDbConnection('db2');
        const Payment = financesConnection.model('Payment', paymentSchema);

        // Clean up previous runs
        await Payment.deleteMany({});

        // Create a payment referencing the new member
        const newPayment = await Payment.create({
            memberId: newMember._id,
            amount: 500.00,
            paymentDate: new Date(),
            type: 'Annual Dues'
        });
        console.log("Created a new payment in 'gym_finances_db':", newPayment.toObject());

    } catch (error) {
        console.error("An error occurred in the main function:", error);
    } finally {
        // Gracefully close all connections
        await closeAllConnections();
        console.log("\n--- Demo finished ---");
    }
}

// Run the main function
main();
