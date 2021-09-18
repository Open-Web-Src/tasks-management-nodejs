const { ObjectId } = require("mongoose").Types;

module.exports = (userRepository, taskRepository) => {
    const execute = async (id) => {
        const result = userRepository.deleteById(id);
        // Delete all related task
        taskRepository.deleteMany({ creator: ObjectId(id) })

        return result;
    };

    return { execute };
}