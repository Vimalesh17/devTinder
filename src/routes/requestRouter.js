import express from "express";
import { userAuth } from "../middleware/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { userModel } from "../models/user.js";

export const requestRoute = express.Router();

requestRoute.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const toUserId = req.params.toUserId;
            const status = req.params.status;
            const fromUserId = req.user._id;

            //  check Touser Presnt in DB
            const toUserData = await userModel.findById(toUserId);
            if (!toUserData) {
                throw new Error("User is not found");
            }
            // Request status Check
            const ALLOWED_REQ_STATUS = ["ignored", "interested"];
            const isAllowedReqStatus = ALLOWED_REQ_STATUS.includes(status);

            if (!isAllowedReqStatus) {
                throw new Error("Invalid Request Status");
            }
            //  request alreay exisit in db

            const exisitConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    {
                        toUserId,
                        fromUserId,
                    },
                    {
                        toUserId: fromUserId,
                        fromUserId: toUserId,
                    },
                ],
            });

            if (exisitConnectionRequest) {
                throw new Error("This Connection Request is already existed");
            }

            const connectionRequest = new ConnectionRequest({
                toUserId,
                fromUserId,
                status,
            });
            const data = await connectionRequest.save();
            res.json({
                message: `${req.user.firstName} is ${status} in ${toUserData.firstName}`,
                data,
            });
        } catch (error) {
            res.status(400).send("Error: " + error.message);
        }
    },
);
