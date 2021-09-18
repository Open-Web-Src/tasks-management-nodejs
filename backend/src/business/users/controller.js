module.exports = class UserController {
    constructor(
        createUserCase,
        updateUserByIdCase,
        deleteUserByIdCase,
        getUserByIdCase,
        loginCase,
        logoutCase,
        updateUserAvatarCase,
        sendCRMMailCase,
    ){
        this.createUserCase = createUserCase;
        this.updateUserByIdCase = updateUserByIdCase;
        this.deleteUserByIdCase = deleteUserByIdCase;
        this.getUserByIdCase = getUserByIdCase;
        this.loginCase = loginCase;
        this.logoutCase = logoutCase;
        this.updateUserAvatarCase = updateUserAvatarCase;
        this.sendCRMMailCase = sendCRMMailCase;
    }

    createUser = async (req, res, next) => {
        try{
            const result = await this.createUserCase.execute(req.body);
            this.sendCRMMailCase.sendWelComeMail(result.createdUser.email, result.createdUser.name);
            res.status(201).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    updateUserById = async (req, res, next) => {
        try{
            const result = await this.updateUserByIdCase.execute(req.user._id, req.body);
            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    deleteUserById = async (req, res, next) => {
        try{
            const result = await this.deleteUserByIdCase.execute(req.user._id);
            this.sendCRMMailCase.sendCancelationMail(result.email, result.name);
            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    getProfile = async (req, res, next) => {
        try{
            res.status(200).json(req.user);
        }
        catch(err){
            err.code = 400;
            next(err);
        }
    }

    login = async (req, res, next) => {
        try{
            const result = await this.loginCase.execute(req.body);
            res.status(200).json(result);
        }catch(err) {
            err.code = 400;
            next(err);
        }
    }

    logout = async (req, res, next) => {
        try{
            await this.logoutCase.execute(req.user, req.credentials);

            res.status(200).json("Logout success");
        } catch(err) {
            err.code = 400;
            next(err);
        }
    }

    logoutAllDevice = async (req, res, next) => {
        try{
            await this.logoutCase.wipeOutExceptCurrent(req.user, req.credentials);

            res.status(200).json("Logout all device success");
        } catch(err) {
            err.code = 400;
            next(err);
        }
    }

    uploadAvatar = async (req, res, next) => {
        try{
            this.updateUserAvatarCase.upload(req.user.id, req.file.buffer);

            res.status(200).json("Upload success");
        } catch(err) {
            err.code = 400;
            next(err);
        }
    }

    deleteAvatar = async (req, res, next) => {
        try{
            this.updateUserAvatarCase.remove(req.user.id);

            res.status(200).json("Delete success");
        } catch(err) {
            err.code = 400;
            next(err);
        }
    }

    getUserAvatar = async (req, res, next) => {
        try{
            const user = await this.getUserByIdCase.execute(req.params.id);

            if(!user || !user.avatar)
                return res.status(200).json("User is not exist or user's avatar is not set");

            res.set('Content-Type', 'image/png');

            res.status(200).send(user.avatar);
        } catch(err) {
            err.code = 400;
            next(err);
        }
    }
}