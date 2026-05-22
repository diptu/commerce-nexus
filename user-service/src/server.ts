// src/server.ts

import "dotenv/config";

import http from "http";

import app from "./index.ts";
import { connectDB } from "./config/db.ts";

const PORT = process.env.PORT || 5001;

const startServer = async (): Promise<void> => {
    try {
        // Connect Database
        await connectDB();

        // Create HTTP Server
        const server = http.createServer(app);

        // Start Listening
        server.listen(PORT, () => {
            console.log(
                `🚀 Server running at http://127.0.0.1:${PORT}`
            );
        });

        // Graceful Shutdown
        process.on("SIGINT", async () => {
            console.log("\n🛑 Shutting down server...");
            server.close(() => {
                console.log("💤 Server closed.");
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();