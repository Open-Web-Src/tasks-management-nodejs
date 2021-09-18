const DEFAULT_LIMIT = 5;
const DEFAULT_SKIP = 0;
const DESCENDING = -1;
const ASCENDING = 1

module.exports = (req, res, next) => {
    try{
        // Configuring for pagination
        const options = {};

        options.limit = req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT;   
        options.skip = req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP;                     

        // Configuring for sorting
        if(req.query.sortBy){
            options.sort = { [req.query.sortBy] : req.query.order === "desc" ? DESCENDING : ASCENDING };
        }

        req.options = options;
        
        next();
    }catch(err){
        next(new Error(err.toString()));
    }
}