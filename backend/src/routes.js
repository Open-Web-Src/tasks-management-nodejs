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

module.exports = class Router {
    constructor() {
        this.initialRepository();
        this.initialServices();
        this.initialRouters();
    }

    initialRepository = () => {
        const userDatabase = new UserDatabase();
        const taskDatabase = new TaskDatabase();

        this.repositories = {};

        this.repositories.users = new Repository(userDatabase);
        this.repositories.tasks = new Repository(taskDatabase);
    }

    initialServices = () => {
        this.services = {};

        this.services.sendGridMail = new SendGridMail();
    }

    initialRouters = () => {
        const controllers = this.buildupControllers();

        const middlewares = this.buildupMiddlewares();

        this.routers = {};

        this.routers.users = new UserRouter(
            controllers.users, 
            middlewares.authentication, 
            middlewares.upload
        );
        this.routers.tasks = new TaskRouter(
            controllers.tasks, 
            middlewares.authentication
        );
    }

    buildupControllers = () => {
        const users = new UserController(
            CreateUser(this.repositories.users),
            UpdateUserById(this.repositories.users),
            DeleteUserById(this.repositories.users, this.repositories.tasks),
            GetUserById(this.repositories.users),
            Login(this.repositories.users),
            Logout(this.repositories.users),
            UpdateUserAvatar(this.repositories.users),
            SendCRMMail(this.services.sendGridMail)
        );

        const tasks = new TaskController(
            GetManyTasks(this.repositories.tasks),
            CreateTask(this.repositories.tasks),
            GetTaskById(this.repositories.tasks),
            UpdateTaskById(this.repositories.tasks),
            DeleteTaskById(this.repositories.tasks)
        );

        return {
            users,
            tasks
        }
    }

    buildupMiddlewares = () => {
        const authentication = new AuthenticateMiddleware(this.repositories.users);
        const upload = multer({
            limits: {
                fileSize: 50000000
            },
            fileFilter(req, file, cb) {
                if(file.originalname.match(/\.(exe|sh)$/)) 
                    return cb(new Error("This extension is not allow"));

                cb(undefined, true)
            }
        });

        return {
            authentication,
            upload
        }
    }

    routes = () => {
        const router = express.Router();

        router.use("/users", this.routers.users.routes());
        router.use("/tasks", this.routers.tasks.routes());

        return router;
    }
}