import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },

        lastName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid");
                }
            },
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 100,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a Strong Password");
                }
            },
        },

        age: {
            type: Number,
            min: 18,
            max: 80,
        },

        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender data is invalid");
                }
            },
        },

        about: {
            type: String,
            default: "This is a default value about user",
        },

        skills: {
            type: [String],
        },

        photoUrl: {
            type: String,
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("PhotoUrl is invalid");
                }
            },
        },
    },
    {
        timestamps: true,
    },
);

export const userModel = mongoose.model("User", userSchema);
