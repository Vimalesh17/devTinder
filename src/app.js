import express from "express";
import { userAuth } from "./middleware/auth.js";
import { connectDb } from "./config/database.js";
import { userModel } from "./models/user.js";
import { validateSignupData } from "./utils/validate.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
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

app.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);

        const { firstName, lastName, email, password, age, skills, about } =
            req?.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new userModel({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            skills,
            about,
        });
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Error: " + error.message);
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        res.status(404).send("User is not found");
    } else {
        const isPasswordCheck = await user.validatePassword(password);
        if (isPasswordCheck) {
            const token = await user.getJwt();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Sucessfully...!");
        } else {
            res.status(400).send("Password is Invalid");
        }
    }
});

app.get("/profile", userAuth, (req, res) => {
    const user = req.user;
    res.send(user);
});

app.post("/sendRequestConnection", userAuth, (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent to request connection");
});
// Error handling middleware
app.use("/", (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

dbConnection();
