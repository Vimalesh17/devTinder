import validator from "validator";

export const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req?.body;
    if (!firstName || !lastName) {
        throw new Error("Name is invalid");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error(
            "First Name field should be contain Maximum Legnth is 50 and Minimum Legnth is 4",
        );
    } else if (lastName.length < 4 || lastName.length > 50) {
        throw new Error(
            "Last Name field should be contain Maximum Legnth is 50 and Minimum Legnth is 4",
        );
    } else if (!email) {
        throw new Error("email is required");
    } else if (!validator.isEmail(email)) {
        throw new Error("email is invalid");
    } else if (!password) {
        throw new Error("Password is required");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Strong Password is required");
    }
};

export const validateEditProfileData = (req) => {
    const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
        "email",
    ];
    const isAllowUpdate = Object.keys(req.body).every((fields) =>
        ALLOWED_UPDATES.includes(fields),
    );
    return isAllowUpdate;
};

export const validateUpdatePassword = (req) => {
    const ALLOWED_UPDATES = ["currentPassword", "newPassword"];
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword) {
        throw new Error("New Password is required");
    }
    if (!newPassword) {
        throw new Error("New Password is required");
    } else if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Strong Password is required");
    }
    const isAllowUpdate = Object.keys(req.body).every((fields) =>
        ALLOWED_UPDATES.includes(fields),
    );
    return isAllowUpdate;
};
