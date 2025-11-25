import mongoose from "mongoose";

const userSchema = new mongoose.Schema (
    {
        email: String,
        password: {type: String, required: true},
        username: {type: String, required: true, unique: true},
        tokens: [
            new mongoose.Schema({
                token: String,
                type: String,
                createdAt: {type: Date, default: Date.now},
                expiresAt: Date
            })
        ]
    }
);

const User = mongoose.model("User", userSchema);
export default User;