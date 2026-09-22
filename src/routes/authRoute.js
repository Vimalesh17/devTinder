import express from "express";
import { validateSignupData } from "../utils/validate.js";
import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";

export const authRoute = express.Router();

// signup

authRoute.post("/signup", async (req, res) => {
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

// login

authRoute.post("/login", async (req, res) => {
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

// logout
authRoute.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.send("Logout sucessfully...!");
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});
