import express from "express";
import { connectDb } from "./config/database.js";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/authRoute.js";
import { profileRoute } from "./routes/profileRoute.js";
import { requestRoute } from "./routes/requestRouter.js";

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
};

app.use(express.json());
app.use(cookieParser());

app.use("/",authRoute)
app.use("/",profileRoute)
app.use("/",requestRoute)

dbConnection();
