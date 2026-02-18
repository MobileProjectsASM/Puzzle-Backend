import { Logger } from "./sources";
import * as logger from "firebase-functions/logger";

export class LoggerCloud implements Logger {
    
    info(tag: string, message: string): void {
        logger.info(message, { tag })
    }

    error(tag: string, message: string, err?: Error): void {
        logger.error(message, { tag, err});
    }
}