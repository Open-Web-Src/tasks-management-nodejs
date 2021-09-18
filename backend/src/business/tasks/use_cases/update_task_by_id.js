const { ObjectId } = require("mongoose").Types;

module.exports = repository => {
    const execute = async (id, creator, fields) => {
        return repository.updateOne(
            { 
                _id: ObjectId(id),
                creator
            }, 
            fields
        );
    }

    return { execute };
}