/**
 * SiteGuide - MongoDB Atlas Connectivity Check
 * File: mongodbPing.js
 * 
 * Instructions:
 * 1. Install dependencies: npm install mongodb dotenv
 * 2. Run the script: node mongodbPing.js
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the specific backend .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

async function runPingCheck() {
  // 1. Validation: Ensure we actually have a URI to test
  if (!uri) {
    console.error('❌ Error: MONGODB_URI not found in .env file.');
    console.log('Ensure c:\\Users\\MY LENOVO\\Documents\\code\\SiteGuide\\backend\\.env contains MONGODB_URI=mongodb+srv://...');
    process.exit(1);
  }

  console.log('🔌 Attempting to connect to MongoDB Atlas...');

  // 2. Client Setup: Using Stable API version for future-proof connectivity
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // 3. Connect: Establish the physical connection to the cluster
    await client.connect();

    // 4. Ping: Execute a low-overhead command to verify the DB is responsive
    // This is better than a full query because it doesn't require specific collections
    await client.db("admin").command({ ping: 1 });

    console.log('✅ Success! You have successfully connected to MongoDB Atlas.');
    console.log('🚀 Your database is reachable and responding to commands.');

  } catch (error) {
    // 5. Error Handling: Catch network issues, auth failures, or IP whitelist blocks
    console.error('❌ Connection Failed!');
    console.error('Details:', error.message);
    
    if (error.message.includes('IP address')) {
      console.log('💡 Tip: Ensure your current IP is added to the Network Access whitelist in Atlas.');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 Tip: Check your database username and password in the MONGODB_URI.');
    }
  } finally {
    // 6. Cleanup: Always close the connection to prevent resource leaks
    await client.close();
    console.log('🔒 Connection closed.');
  }
}

runPingCheck();
