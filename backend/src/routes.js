const express = require("express");
const UserRouter = require("./business/users/route");
const TaskRouter = require("./business/tasks/route");
const Repository = require("./core/repository");
const UserDatabase = require("./business/users/data_access/database");
const UserController = require("./business/users/controller");
const CreateUser = require("./business/users/use_cases/create_user");
const UpdateUserById = require("./business/users/use_cases/update_user_by_id");
const DeleteUserById = require("./business/users/use_cases/delete_user_by_id");
const GetUserById = require("./business/users/use_cases/get_user_by_id");
const Login = require("./business/users/use_cases/login");
const Logout = require("./business/users/use_cases/logout");
const UpdateUserAvatar = require("./business/users/use_cases/update_user_avatar");
const SendCRMMail = require("./business/users/use_cases/send_crm_mail");
const TaskDatabase = require("./business/tasks/data_access/database");
const TaskController = require("./business/tasks/controller");
const GetManyTasks = require("./business/tasks/use_cases/get_many_tasks");
const CreateTask = require("./business/tasks/use_cases/create_task");
const GetTaskById = require("./business/tasks/use_cases/get_task_by_id");
const UpdateTaskById = require("./business/tasks/use_cases/update_task_by_id");
const DeleteTaskById = require("./business/tasks/use_cases/delete_task_by_id");
const AuthenticateMiddleware = require("./business/users/middlewares/authentication");
const multer = require("multer");
const SendGridMail = require("./core/emails/sendgrid_mail");


module.exports = () => {
    // Instantiate business databases
    const userDatabase = new UserDatabase();
    const taskDatabase = new TaskDatabase();

    // Instantiate repositories and inject respective databases
    const userRepository = new Repository(userDatabase);
    const taskRepository = new Repository(taskDatabase);

    // Instantiate services
    const sendGridMail = new SendGridMail();

    // Instantiate use-cases and inject dependencies including repositories, services
    // Instantiate controllers and inject respective use-cases
    const userController = new UserController(
        CreateUser(userRepository),
        UpdateUserById(userRepository),
        DeleteUserById(userRepository, taskRepository),
        GetUserById(userRepository),
        Login(userRepository),
        Logout(userRepository),
        UpdateUserAvatar(userRepository),
        SendCRMMail(sendGridMail)
    );
    const taskController = new TaskController(
        GetManyTasks(taskRepository),
        CreateTask(taskRepository),
        GetTaskById(taskRepository),
        UpdateTaskById(taskRepository),
        DeleteTaskById(taskRepository)
    );

    // Instantiate middlewares 
    const authentication = new AuthenticateMiddleware(userRepository);
    const uploadUser = multer({
        limits: {
            fileSize: 50000000
        },
        fileFilter(req, file, cb) {
            if(file.originalname.match(/\.(exe|sh)$/)) 
                return cb(new Error("This extension is not allow"));

            cb(undefined, true)
        }
    });

    // Instantiate routers and inject respective controllers and middlewares
    const router = express.Router();
    const userRouter = new UserRouter(
        userController, 
        authentication, 
        uploadUser
    );
    const taskRouter = new TaskRouter(
        taskController, 
        authentication
    );

    router.use("/users", userRouter.routes());
    router.use("/tasks", taskRouter.routes());

    return router;
}