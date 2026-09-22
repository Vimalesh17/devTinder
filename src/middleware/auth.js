import jwt from "jsonwebtoken";
import { userModel } from "../models/user.js";

export const userAuth = async (req, res, next) => {
    console.log("user auth checking....");
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is Invalid");
        }
        const decodedObj = jwt.verify(token, "VIMALESH@17");
        const { _id } = decodedObj;
        const user = await userModel.findById( _id );
        if (!user) {ß
           return res.status(404).send("User is not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
};
