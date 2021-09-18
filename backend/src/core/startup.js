const express = require("express");
const Database = require("./database");

module.exports = class Application extends express {
    constructor(){
       super();
    }

    registerDatabase = (connection) => {
        try{
            new Database(connection);
        } catch(err) {
            throw new Error(err.toString());
        }
    };
    
    registerHealthCheck = () => {
        try{
            const healthRouter = express.Router();
            this.route('/')
                .get((req, res) => {
                    res.json({
                    status: {
                        application: "up",
                        database: "up"
                    }
                    })
                });

            this.use('/health', healthRouter);
        } catch(err) {
            throw new Error(err.toString());
        }
    }
    
    registerMiddlewares = (middlewares) => {
        try{
            middlewares.forEach(middleware => this.use(middleware));
        } catch(err) {
            throw new Error(err.toString());
        }
    }
    
    registerRoutes = (path, router) => {
        try{
            this.use(path, router);
        } catch(err) {
            throw new Error(err.toString());
        }
    }
}