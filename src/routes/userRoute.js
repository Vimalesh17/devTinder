import express from "express";
import { userAuth } from "../middleware/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { userModel } from "../models/user.js";

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
        const data = connectionRequests.map((row) => {
            if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
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

userRoute.get("/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

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
                },
                {
                    toUserId: loggedInUser._id,
                },
            ],
        }).select(["fromUserId", "toUserId"]);

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((req) => {
            (hideUserFromFeed.add(req.fromUserId.toString()),
                hideUserFromFeed.add(req.toUserId.toString()));
        });
        const user = await userModel
            .find({
                $and: [
                    {
                        _id: { $nin: Array.from(hideUserFromFeed) },
                    },
                    {
                        _id: { $ne: loggedInUser._id },
                    },
                ],
            })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Feed user fetched successfully!",
            data: user,
        });
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});
