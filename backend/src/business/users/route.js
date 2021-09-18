const express = require("express");

module.exports = class UserRouter {
    constructor(
        controller,
        authentication,
        upload
    ) {
        this.controller = controller;
        this.authentication = authentication;
        this.upload = upload;
    }

    routes = () => {
        const router = express.Router();

        router.route('/')
            .post(this.controller.createUser);

        router.route('/login')
            .post(this.controller.login);

        router.route('/logout')
            .all(this.authentication.authenticate)
            .post(this.controller.logout);
        
        router.route('/logoutAllDevice')
            .all(this.authentication.authenticate)
            .post(this.controller.logoutAllDevice);

        router.route('/me')
            .all(this.authentication.authenticate)
            .get(this.controller.getProfile)
            .patch(this.controller.updateUserById)
            .delete(this.controller.deleteUserById);

        router.route('/me/avatar')
            .all(this.authentication.authenticate, this.upload.single('file'))
            .post(this.controller.uploadAvatar)
            .delete(this.controller.deleteAvatar);

        router.route('/:id/avatar')
            .get(this.controller.getUserAvatar);

        return router;
    }
}