const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BaseSchema = require("../../../core/schema");

module.exports = class UserSchema extends BaseSchema {
    constructor(){
        const configuration = {
            name: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                validate(value) {
                    if(!validator.isEmail(value)) throw new Error("Email is invalid");
                }
            },
            password: {
                type: String,
                required: true,
                minlength: 7,
                trim: true,
                validate(value) {
                    if(value.includes("password")) throw new Error("Password can not contain 'password'");
                }
            },
            age: {
                type: Number,
                default: 0,
                validate(value) {
                    if(value < 0) throw new Error("Age must be a positive number");
                }
            },
            tokens: [
                {
                    token: {
                        type: String,
                        required: true
                    }
                }
            ],
            avatar: {
                type: Buffer
            }
        };

        super(configuration);

        const saveMiddlewares = ['save', 'insertMany', 'updateOne', 'updateMany'];
        saveMiddlewares.forEach(type => this.applyHashingPassword(type));

        // Reference to Task model
        this.virtual('tasks', {
            ref: 'tasks',
            localField: '_id',
            foreignField: 'creator'
        })

        // Hide sensitive data
        this.methods.toJSON = function () {
            const user = this;
            const userObj = user.toObject();

            delete userObj.password;
            delete userObj.tokens;
            delete userObj.avatar;

            return userObj;
        }

        // Generate Authentication token -- Instance method
        this.methods.generateAuthToken = async function () {
            const user = this;
            const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

            user.tokens = [...user.tokens, { token }];
            user.save();

            return token;
        }

        // Validate user's credentials -- Model method
        this.statics.validateCredentials = async (password, hash) => {
            return bcrypt.compare(password, hash);
        }
    }

    // Hash the plain text password before saving
    applyHashingPassword = async type => {
        this.pre(type, async function (next) {
            const user = this;

            if(user._update){ // updateOne OR updateMany
                if(user._update.password){
                    user._update.password = await bcrypt.hash(user._update.password, 8);
                }
            }
            else if(user.isModified('password')) { // save OR insertMany
                user.password = await bcrypt.hash(user.password, 8);
            }
            
            next();
        });
    }
}