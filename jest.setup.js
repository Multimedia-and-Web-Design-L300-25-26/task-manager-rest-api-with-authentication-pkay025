import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { jest } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

// First run on Windows can be slow (MongoDB binary download + startup).
jest.setTimeout(180000);

dotenv.config({ path: ".env.test" });
dotenv.config(); // allow local .env too

let mongoServer;

beforeAll(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

  // mongodb-memory-server has its own startup timeout (default 10s).
  process.env.MONGOMS_STARTUP_TIMEOUT =
    process.env.MONGOMS_STARTUP_TIMEOUT || "120000";

  // Keep mongodb-memory-server binaries/tmp inside the repo (Windows + CI friendly).
  process.env.MONGOMS_DOWNLOAD_DIR =
    process.env.MONGOMS_DOWNLOAD_DIR || path.join(__dirname, ".cache", "mongoms");
  process.env.MONGOMS_TMP_DIR =
    process.env.MONGOMS_TMP_DIR || path.join(__dirname, ".cache", "mongoms-tmp");

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
