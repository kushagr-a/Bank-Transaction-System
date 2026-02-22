import morgan from "morgan";
import logger from "./wistonLogger";

// Create separate stream object
const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

const format =
    ":remote-addr :method :url :status :res[content-length] - :response-time ms";

const morganLogger = morgan(format, { stream });

export default morganLogger;