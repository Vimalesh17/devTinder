import express from "express";
import { adminAuth, userAuth } from "./middleware/auth.js";
import { connectDb } from "./config/database.js";
import { userModel } from "./models/user.js";
import mongoose from "mongoose";
import { validateSignupData } from "./utils/validate.js";
import bcrypt from "bcrypt";
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
        const isPasswordCheck = await bcrypt.compare(password, user?.password);
        if (isPasswordCheck) {
            res.send("Login Sucessfully...!");
        } else {
            res.status(400).send("Password is Invalid");
        }
    }
});
app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userDetail = await userModel.find({ email: userEmail });
        if (userDetail?.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userDetail);
        }
    } catch (error) {
        res.statusCode(500).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const userDetail = await userModel.find({});
        if (userDetail?.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userDetail);
        }
    } catch (error) {
        res.statusCode(500).send("Something went wrong");
    }
});

app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const userDetail = await userModel.findByIdAndDelete(userId);
        if (!userDetail) {
            res.status(404).send("User is Not found");
        } else {
            res.send("User Details deleted  Successfully");
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// app.patch("/user", async (req, res) => {
//     try {
//         const { userId, data } = req.body;

//         const userDetail = await userModel.findOneAndUpdate(userId, data);
//         if (!userDetail) {
//             res.status(404).send("User is Not found");
//         } else {
//             res.send("User Details updated  Successfully");
//         }
//     } catch (error) {
//         console.log("ERROR:", error);
//         res.status(500).send("Something went wrong");
//     }
// });

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("useriddddd", userId);
        const { ...data } = req.body;
        const ALLOWED_UPDATES = [
            "photoUrl",
            "age",
            "about",
            "skills",
            "gender",
        ];
        const isAllowedKeys = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k),
        );
        if (!isAllowedKeys) {
            return res.status(400).send("Invalid update field");
        }
        if (data?.skills?.length > 10) {
            throw new Error("10 skills only allowed");
        }
        const userDetail = await userModel.findByIdAndUpdate(userId, data, {
            runValidators: true,
        });
        if (!userDetail) {
            res.status(404).send("User is Not found");
        } else {
            res.send("User Details updated  Successfully");
        }
    } catch (error) {
        console.log("ERROR:", error);
        res.status(400).send("ERROR" + error.message);
    }
});

// Error handling middleware
app.use("/", (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

dbConnection();
