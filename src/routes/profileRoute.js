import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
    validateEditProfileData,
    validateUpdatePassword,
} from "../utils/validate.js";
import bcrypt from "bcrypt";

export const profileRoute = express.Router();

// profile

profileRoute.get("/profile/view", userAuth, (req, res) => {
    const user = req.user;
    res.send(user);
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isAllowUpdate = validateEditProfileData(req);

        if (!isAllowUpdate) {
            throw new Error("Invalid  edit request");
        } else {
            const loggedInUser = req.user;
            Object.keys(req.body).forEach(
                (key) => (loggedInUser[key] = req.body[key]),
            );
            await loggedInUser.save();
            console.log(loggedInUser);
            res.json({
                message: `${loggedInUser?.firstName},Your Profile is Updated Sucessfully..!`,
                updatedData: loggedInUser,
            });
        }
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
    const user = req.user;
    res.send(user);
});

profileRoute.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const isAllowUpdate = validateUpdatePassword(req);
        if (!isAllowUpdate) {
            throw new Error("Invalid  update password request");
        } else {
            const { currentPassword, newPassword } = req.body;
            const loggedInUser = req.user;
            const isPasswordValid =
                await loggedInUser.validatePassword(currentPassword);

            if (!isPasswordValid) {
                return res.status(401).send("Current password is incorrect");
            }
            const updatedPasswordHash = await bcrypt.hash(newPassword, 10);
            loggedInUser.password = updatedPasswordHash;
            await loggedInUser.save();
            res.json({
                message: `${loggedInUser?.firstName},Your Password was Updated Sucessfully..!`,
                updatedData: loggedInUser,
            });
        }
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});
