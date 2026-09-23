import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
    {
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        status: {
            type: String,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {
        timestamps: true,
    },
);

connectionRequestSchema.index({ toUserId: 1, fromUserId:1 })

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Can't send connection request to yourself...");
    }
});

export const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema,
);
