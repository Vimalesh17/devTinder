import mongoose from "mongoose";

export const connectDb = async () => {
        await mongoose.connect('mongodb+srv://Vimalesh:admin123@nodejs1.8ryv0jd.mongodb.net/?appName=Nodejs1&dbName=devTinder');
}
