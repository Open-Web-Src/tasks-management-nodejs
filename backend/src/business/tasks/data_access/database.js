const mongoose = require("mongoose");
const TaskSchema = require("./schema");

module.exports = class TaskDatabase {
    constructor() {        
        return mongoose.model("tasks", new TaskSchema());
    }
}