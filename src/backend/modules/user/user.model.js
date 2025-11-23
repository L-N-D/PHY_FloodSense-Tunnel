import mongoose from "mongoose";

const userSchema = new mongoose.Schema (
    {
        email: String,
        password: {type: String, require: true},
        username: {type: String, require: true, unique: true}
    }
);

module.exports = mongoose.model("User", userSchema);