const bodyParser = require('body-parser');
const errorHandling = require('./core/middlewares/handling_error');
const jwtVerifier = require('./core/middlewares/jwt_verification');
const paginationAndSorting = require("./core/middlewares/pagination_and_sorting");
const Application = require("./core/startup");
const Router = require('./routes');

const app = new Application();

const {MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_DATABASE} = process.env;
app.registerDatabase(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?authSource=admin`);

app.registerHealthCheck();

app.registerMiddlewares(
    [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        jwtVerifier,
        paginationAndSorting
    ]
);

app.registerRoutes("/api", Router())

app.registerMiddlewares(
    [
        errorHandling
    ]
);

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});