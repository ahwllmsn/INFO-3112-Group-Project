import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  const client = new MongoClient(process.env.DB_URI);
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully!");
    const db = client.db("test"); // or any DB name
    console.log("Databases available:", await db.admin().listDatabases());
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

testConnection();