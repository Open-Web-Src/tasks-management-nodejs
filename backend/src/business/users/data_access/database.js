const mongoose = require("mongoose");
const UserSchema = require("./schema");

module.exports = class UserDatabase {
    constructor() {
        return mongoose.model("users", new UserSchema());
    }
}