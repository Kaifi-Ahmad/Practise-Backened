import dotenv from "dotenv"

dotenv.config()


import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import {connection} from "./db/index.js"
import {app} from "./app.js"
import { configureCloudnary } from "./utils/cloudinary.js";

 const port=process.env.PORT||3000


connection().then(()=> {

configureCloudnary()

    app.listen(port,()=> {
        console.log(`App is listen at port ${port}`);
    })
}).catch((error) => {
    console.error("Error: ",error);
    process.exit(1)
})


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