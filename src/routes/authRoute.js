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

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }
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

        const data = await user.save();
        const token = jwt.sign(
            {
                _id: data._id,
            },
            JWT_SECRET,
            {
                expiresIn: "8h",
            },
        );
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 8 * 60 * 60 * 1000, // 8 hours
            sameSite: "lax",
            secure: false, // true in production with HTTPS
        });

        res.json({ message: "User added successfully", data });
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Error: " + error.message);
    }
});

authRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        res.status(404).send("User is not found");
    } else {
        const isPasswordCheck = await user.validatePassword(password);
        if (isPasswordCheck) {
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                JWT_SECRET,
                {
                    expiresIn: "8h",
                },
            );
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 8 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: false,
            });
            res.json({
                message: "Login Successfully",
                data: user,
            });
        } else {
            res.status(400).send("Password is Invalid");
        }
    }
});

authRoute.post("/logout", async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "lax",
            secure: false,
        });
        res.send("Logout sucessfully...!");
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});
