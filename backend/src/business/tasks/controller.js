module.exports = class TaskController {
    constructor(
        getManyTasksCase,
        createTaskCase,
        getTaskByIdCase,
        updateTaskByIdCase,
        deleteTaskByIdCase
    ) {
        this.getManyTasksCase = getManyTasksCase;
        this.createTaskCase = createTaskCase;
        this.getTaskByIdCase = getTaskByIdCase;
        this.updateTaskByIdCase = updateTaskByIdCase;
        this.deleteTaskByIdCase = deleteTaskByIdCase;
    }

    // GET /tasks?completed=true
    // GET /tasks?limit=10&skip=20
    // GET /tasks?sortBy=createdAt&order=desc
    getManyTasks = async (req, res, next) => {
        try{
            const result = await this.getManyTasksCase.execute(req.user, req.options, req.query);

            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    createTask = async (req, res, next) => {
        try{
            const result = await this.createTaskCase.execute({
                ...req.body,
                creator: req.user._id
            });
            res.status(201).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    getTaskById = async (req, res, next) => {
        try{
            const result = await this.getTaskByIdCase.execute(req.params.id, req.user._id);
            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    updateTaskById = async (req, res, next) => {
        try{
            const result = await this.updateTaskByIdCase.execute(req.params.id, req.user._id, req.body);
            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }

    deleteTaskById = async (req, res, next) => {
        try{
            const result = await this.deleteTaskByIdCase.execute(req.params.id, req.user._id);
            res.status(200).json(result);
        }catch(err){
            err.code = 400;
            next(err);
        }
    }
}