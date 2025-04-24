import { Context } from "hono";

function devLog({
  c,
  message,
  fileName,
  line,
  data,
}: {
  c: Context;
  message: string;
  fileName: string;
  line: number;
  data?: any;
}): void {
  const isDev = c.env?.NODE_ENV === "development" || !c.env?.NODE_ENV;

  if (isDev) {
    const timestamp = new Date().toISOString();
    const fileInfo = `${fileName}:${line}`;

    const logMessage = `[${timestamp}] [${fileInfo}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}

function getFileInfo(): { fileName: string; line: number } {
  const stack = new Error().stack;
  const caller = stack?.split("\n")[2] || "";

  const match = caller.match(/at\s+(.+):(\d+):(\d+)/);

  if (match) {
    const fullPath = match[1];
    const line = parseInt(match[2] || "0", 10);

    const fileName = fullPath?.split("/").pop() || fullPath;

    return { fileName: fileName || "Unknown", line };
  }

  return { fileName: "unknown", line: 0 };
}

export function log(c: Context, message: string, data?: any): void {
  const { fileName, line } = getFileInfo();
  devLog({ c, message, fileName, line, data });
}
