import mongoose from "mongoose";

const connection=async ()=> {
    try {
       const connectionInstance= await mongoose.connect(process.env.MONGO_URL)
        console.log("Connection Successfull✅");
    } catch (error) {
        console.error("Error: ",error);
        process.exit(1)
    }
}

export {connection}