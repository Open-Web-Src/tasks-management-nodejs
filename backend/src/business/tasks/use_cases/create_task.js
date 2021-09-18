const Task = require("../model");

module.exports = repository => {
    const execute = async (newEntity) => {
        const {name, description, completed, creator} = newEntity;

        const existingTask = await repository.getOne({ name });
        if(existingTask) throw new Error("Task is already existed");

        const newTask = new Task(name, description, completed, creator);
        return repository.create(newTask);
    };

    return { execute };
}