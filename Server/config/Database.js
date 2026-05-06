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
        console.log(error);
        process.exit(1);
    }
}
export default ConnectDB;