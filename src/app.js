import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cors({
    origin:process.env.CORS_ORIGIN?process.env.CORS_ORIGIN.split(","):["http://localhost:5173"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"],
    methods:["GET","POST","DELETE","PUT","OPTIONS"]
}))
app.use(cookieParser())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export {app}