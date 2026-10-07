const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


let mongoose=require("mongoose")


let connectDb=async()=>{

if (!process.env.URLSTRING) {
throw new Error("Missing URLSTRING in the backend environment file");
}

await mongoose.connect(process.env.URLSTRING)

}


module.exports=connectDb