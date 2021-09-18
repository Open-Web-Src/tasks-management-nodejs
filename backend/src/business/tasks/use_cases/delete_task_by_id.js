const { ObjectId } = require("mongoose").Types;

module.exports = repository => {
    const execute = async (id, creator) => {
        return repository.deleteOne({
            _id: ObjectId(id),
            creator
        });
    }

    return { execute };
}