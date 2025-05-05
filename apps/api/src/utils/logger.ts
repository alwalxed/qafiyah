export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export const logger = {
  debug: (data?: any) => {
    console.debug(
      JSON.stringify({
        level: LogLevel.DEBUG,
        timestamp: new Date().toISOString(),
        data,
      })
    );
  },
  info: (data?: any) => {
    console.info(
      JSON.stringify({
        level: LogLevel.INFO,
        timestamp: new Date().toISOString(),
        data,
      })
    );
  },
  warn: (data?: any) => {
    console.warn(
      JSON.stringify({
        level: LogLevel.WARN,
        timestamp: new Date().toISOString(),
        data,
      })
    );
  },
  error: (error?: any, data?: any) => {
    console.error(
      JSON.stringify({
        level: LogLevel.ERROR,

        timestamp: new Date().toISOString(),
        error: error?.message || error,
        stack: error?.stack,
        data,
      })
    );
  },
};
