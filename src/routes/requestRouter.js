import express from "express";
import { userAuth } from "../middleware/auth.js";

export const requestRoute = express.Router();

requestRoute.post("/sendRequestConnection", userAuth, (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent to request connection");
});
