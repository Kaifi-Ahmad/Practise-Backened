import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import {connection} from "./db/index.js"
import dotenv from "dotenv"
import express from "express"

dotenv.config({path:"./.env"})
 const app=express()
 const port=process.env.PORT||3000


connection()


// ;(async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log("Connection Successfull✅");
        
//         app.on("error",(error)=> {
//             console.error("Error: ",error)
//             throw error
//         })
//     app.listen(port,()=> {
//         console.log(`App is listen on port ${port}`);
        
//     })
//     } catch (error) {
//         console.error("Error: ",error)
//         throw error
//     }
// })()