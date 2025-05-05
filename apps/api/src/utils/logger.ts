type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  debug(message: string | object, ...args: any[]): void {
    if (typeof message === "string") {
      console.debug(message, ...args);
    } else {
      console.debug({
        level: "debug",
        timestamp: new Date().toISOString(),
        ...message,
      });
    }
  }

  info(message: string | object, ...args: any[]): void {
    if (typeof message === "string") {
      console.log(message, ...args);
    } else {
      console.log({
        level: "info",
        timestamp: new Date().toISOString(),
        ...message,
      });
    }
  }

  warn(message: string | object, ...args: any[]): void {
    if (typeof message === "string") {
      console.warn(message, ...args);
    } else {
      console.warn({
        level: "warn",
        timestamp: new Date().toISOString(),
        ...message,
      });
    }
  }

  error(message: string | object, ...args: any[]): void {
    if (typeof message === "string") {
      console.error(message, ...args);
    } else {
      console.error({
        level: "error",
        timestamp: new Date().toISOString(),
        ...message,
      });
    }
  }
}

export const logger = new Logger();
