import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch(err){
        console.log("error in connecting: ",err);
        process.exit(1); //1 means failure
    }
}