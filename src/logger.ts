import { createLogger, format, transports } from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Always log to console
    new transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
  ],
});

// In production, also write logs to files
if (process.env.NODE_ENV === "production") {
  logger.add(
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    })
  );
  logger.add(
    new transports.File({
      filename: path.join("logs", "combined.log"),
    })
  );
}

export default logger;