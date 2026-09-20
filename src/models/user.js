import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:String
    },
    gender:{
        type:String
    }
})

export const userModel = mongoose.model("User", userSchema);