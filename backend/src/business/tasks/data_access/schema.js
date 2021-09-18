const BaseSchema = require("../../../core/schema");
const { ObjectId } = require("mongoose").Types;

module.exports = class TaskSchema extends BaseSchema {
    constructor(){
        const configuration = {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            completed: {
                type: Boolean,
                default: false
            },
            creator: {
                type: ObjectId,
                required: true,
                ref: 'users'
            }
        };

        super(configuration);
    }
}