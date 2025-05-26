import app from './app';
import config from "./configs/config";
import logger from "./utils/logger";

const server = app.listen(config.PORT);
(() => {
    try {
        logger.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
        logger.error(`APPLICATION_ERROR`, { meta: error })
        server.close((err) => {
            if (err) {
                logger.error(`APPLICATION_ERROR`, { meta: error })
            }
            process.exit(1)

        })
    }
})()