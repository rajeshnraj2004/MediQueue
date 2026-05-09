import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            family: 4,
        });
        console.log("Database Connected Successfully");
    }catch(error){
        console.error("!!! MongoDB Connection Error !!!");
        console.error("Note: AI features will still work, but Admin features requiring DB will fail.");
        console.error("Error Detail:", error.message);
        // Removed process.exit(1) to allow server to stay running
    }
}
export default ConnectDB;