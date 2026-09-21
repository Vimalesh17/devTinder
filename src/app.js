import express from "express";
import { adminAuth, userAuth } from "./middleware/auth.js";
import { connectDb } from "./config/database.js";
import { userModel } from "./models/user.js";
import mongoose from "mongoose";

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
        const user = new userModel(req.body);

        await user.save();
        res.send("User added successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong");
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

app.patch("/user", async (req, res) => {
    try {
        const { userId, ...data } = req.body;

        const userDetail = await userModel.findByIdAndUpdate(userId, data);
        if (!userDetail) {
            res.status(404).send("User is Not found");
        } else {
            res.send("User Details updated  Successfully");
        }
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).send("Something went wrong");
    }
});

// Error handling middleware
app.use("/", (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

dbConnection();
