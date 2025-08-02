import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.VCHAT_API_KEY;
const apiSecret = process.env.VCHAT_API_SECRET;

if(!apiKey || !apiSecret) {
    console.error("VCHAT_API_KEY or VCHAT_API_SECRET is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;

        console.log(`Stream user upserted: ${userData.name}`);
    }catch(err){
        console.error("Error creating Stream user:", err);
    }
};

//to do later
export const generateStreamToken = (userId)=>{
    try{
        //ensure userId is string
        const userIdStr= userId.toString();;
        return streamClient.createToken(userIdStr);
        
    }catch(err){
        console.error("Error generating Stream token:", err);
    }
}