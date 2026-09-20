import express from 'express';

const app = express();

app.use("/users",(req,res,next)=>{
   console.log("route handler 1")
   next()}
,(req,res,next)=>{
   console.log("route handler 2")
//    res.send("Route handler 2 response")
next();
},(req,res,next)=>{
   console.log("route handler 3")
//    res.send("Route handler 3 response")
next();
},(req,res,next)=>{
   console.log("route handler 4")
//    res.send("Route handler 4response")
next(); 
},(req,res,next)=>{
   console.log("route handler 5")
   res.send("Route handler 5 response")
})

app.listen(7777,()=>{
console.log("app is listening on PORT :7777")
})