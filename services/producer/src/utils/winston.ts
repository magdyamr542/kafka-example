import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] : ${JSON.stringify(
        info.message
      )}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
