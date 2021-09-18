module.exports = class Task {
    constructor(name, description, completed, creator){
        this.name = name;
        this.description = description;
        this.completed = completed;
        this.creator = creator;
    }
}