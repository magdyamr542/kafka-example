import winston, { format } from "winston";

export const logger = winston.createLogger({
  format: winston.format.combine(
    format.colorize(),
    format.prettyPrint(),
    format.splat(),
    format.simple(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      return `${info.timestamp} [${info.level}] : ${JSON.stringify(
        info.message
      )}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
