import express from 'express';
import { adminAuth,userAuth} from './middleware/auth.js'

const app = express();

app.use("/admin",adminAuth)

app.get("/admin/getAllData",(req,res,next)=>{
  res.send("Fetch all admin data")
 })
   
   app.delete("/admin/deleteUser",(req,res,next)=>{
  res.send("Delete users data")
   })

app.get("/users",userAuth,(req,res,next)=>{

throw new Error("Something went wrong")
  res.send("Fetch all users data")
})

// Error handling middleware
app.use('/', (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error')
})

app.listen(7777,()=>{
console.log("app is listening on PORT :7777")
})