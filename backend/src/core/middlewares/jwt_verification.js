const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        if(req.header('Authorization')){
            const token = req.header('Authorization').replace('Bearer ', '');
            req.credentials = {
                decoded: jwt.verify(token, process.env.SECRET),
                token
            };
        }
        next();
    }catch(err){
        next(new Error(err.toString()));
    }
}