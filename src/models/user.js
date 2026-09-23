import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "VIMALESH@17", {
        expiresIn: "1d",
    });
    return token;
};
userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordCheck = await bcrypt.compare(passwordInput, passwordHash);
    return isPasswordCheck;
};
export const userModel = mongoose.model("User", userSchema);
