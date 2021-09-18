const express = require("express");

module.exports = class TaskRouter {
    constructor(
        controller,
        authentication
    ){
        this.controller = controller;
        this.authentication = authentication;
    }

    routes = () => {
        const router = express.Router();

        router.route('/')
            .all(this.authentication.authenticate)
            .get(this.controller.getManyTasks)
            .post(this.controller.createTask);

        router.route('/:id')
            .all(this.authentication.authenticate)
            .get(this.controller.getTaskById)
            .patch(this.controller.updateTaskById)
            .delete(this.controller.deleteTaskById);
        
        return router;
    }
}