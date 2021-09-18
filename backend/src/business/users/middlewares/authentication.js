const { ObjectId } = require("mongoose").Types;

module.exports = class Authenticate {
    constructor(repository) {
        this.repository = repository;
    }

    authenticate = async (req, res, next) => {
        try{
            if(!req.credentials) {
                let err = new Error("Crdentials is missing");
                err.code = 400;
                throw err;
            }

            const { decoded: { _id }, token } = req.credentials;
            const user = await this.repository.getOne({ _id: ObjectId(_id), 'tokens.token': token });

            if(!user) {
                let err = new Error("User is not exist. Authenticate fail");
                err.code = 400;
                throw err;
            }
    
            req.user = user;
            next();
        }catch(err){
            next(err);
        }
    };
}