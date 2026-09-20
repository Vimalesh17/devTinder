import express from 'express';
import { adminAuth,userAuth} from './middleware/auth.js'
import { connectDb } from './config/database.js';
import { userModel } from './models/user.js';

const app = express();
const dbConnection = async () => {
    try {
        await connectDb();
        console.log("Database connected successfully");
        app.listen(7777, () => {
            console.log("app is listening on PORT :7777");
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

app.post("/signup",async(req,res)=>{

    try{
const user = new userModel({
        firstName:'vignesh',
        lastName:'Panneer',
        email:'vicky@gmail.com',
        password:'admin@1234',
        age:33,
        gender:'male'
    })

    await user.save()
    res.send("User added successfully")
    }catch(error){
        console.error(error.message)
        res.status(500).send("Something went wrong")
    }
    

})

// Error handling middleware
app.use('/', (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error')
})

dbConnection()