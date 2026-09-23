import express from "express";
import { userAuth } from "../middleware/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";

export const userRoute = express.Router();

userRoute.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", [
            "firstName",
            "lastName",
            "age",
            "about",
            "photoUrl",
        ]);
        if (!connectionRequests) {
            res.status(404).json({ message: "No request received" });
        }
        res.json({
            message: "Connection requests are fetched successfully...!",
            data: connectionRequests,
        });
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

userRoute.get("/user/connections", userAuth, async (req, res) => {
    try {
        const USER_SAFE_DATA = [
            "firstName",
            "lastName",
            "age",
            "about",
            "photoUrl",
        ];

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted",
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted",
                },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        if (connectionRequests.length === 0) {
            return res.status(404).json({
                message: "No connections found",
                data: [],
            });
        }

        const data = connectionRequests.map((row) => {
            if (
                row.toUserId._id.toString() ===
                loggedInUser._id.toString()
            ) {
                return row.fromUserId;
            }

            return row.toUserId;
        });

        res.json({
            message: "Accepted connections list fetched successfully!",
            data,
        });
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});