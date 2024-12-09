import {app} from './middleware/app.middleware.js';
import routes from './routes/index.route.js';
import {LoggerLib} from './libs/Logger.lib.js';
import ResponseLib from './libs/Response.lib.js';
import {AssertionError} from "assert";
import {CelebrateError} from 'celebrate';
import ErrorLib from "./libs/Error.lib.js";
import {connect} from "./database/connect.js";
import {initializeTables} from './database/initialise.js';

const port = process.env.PORT || 3000;

app.get('/', (req, res) => new ResponseLib(req, res).status(200).json({message: 'KENKEPUTA BACKEND APP!'}));
app.use('/api', routes);

app.use((req, res) => {
    new ResponseLib(req, res).status(404).json({message: 'Not Found'});
});

app.use((err, req, res, next) => {
    LoggerLib.error(err);

    let message = err.message;
    let statusCode = err.code;
    if (err instanceof ErrorLib) {
        message = err.message;
        statusCode = err.code;
    } else if (err instanceof CelebrateError) {
        message = err.details.entries().next().value[1].details[0].message.replace(/["]+/g, '').replace(/_/g, ' ')
        statusCode = 400;
    } else if (err instanceof AssertionError) {
        message = err.message;
        statusCode = 400;
    }
    new ResponseLib(req, res).status(statusCode).json({message, status: false});
});

const start = async () => {
    try {
        await connect();
        await initializeTables();
        app.listen(port, async () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        LoggerLib.error(e)
    }
}

start()
