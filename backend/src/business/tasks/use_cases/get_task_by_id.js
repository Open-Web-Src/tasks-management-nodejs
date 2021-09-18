const { ObjectId } = require("mongoose").Types;

module.exports = repository => {
    const execute = async (_id, creator) => {
        return repository.getOne({
            _id: ObjectId(_id),
            creator
        });
    }

    return { execute };
}