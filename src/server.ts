import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import { envVar } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVar.DB_URL);
    console.log("✅ MongoDB Connected");

    server = app.listen(envVar.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${envVar.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();



process.on("SIGTERM",()=>{
    console.log("SIGTERM signal recieved... Server shutting down..");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})
