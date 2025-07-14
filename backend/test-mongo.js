const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace <db_password> with your actual password
const uri = "mongodb+srv://nileshmistry12355:nileshmistry12355@cluster0.w3xm9n6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}
run().catch(console.dir); 