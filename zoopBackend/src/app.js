require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
let express=require("express")
let cors=require("cors")

let app=express();
app.use(express.json())
app.use(
cors({
origin: [
  process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
],
})
)
let agentsRouter=require('./routes/agensts')
let connectDb=require("./config/database")

app.use("/",agentsRouter);
connectDb().then(()=>{
    console.log("connected to db")
    app.listen(7000,()=>{
    console.log("server listing on port 7000")
})

}).catch((err)=>{
    console.log(err.message)
})

