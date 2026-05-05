import mongoose from "mongoose";
import dotenv from "dotenv";

const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
export default ConnectDB;