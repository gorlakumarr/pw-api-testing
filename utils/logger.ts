import { log } from "node:console";

export class APILogger {
  private recentLogs: any[] = [];
  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any,
  ) {
    const logEntry = { method, url, headers, body, timestamp: new Date() };
    this.recentLogs.push({ type: "Request Details : ", ...logEntry });
    console.log("Logged Request:", logEntry);
  }

  logResponse(
    statusCode: number,
    url: string,
    headers: Record<string, string>,
    body?: any,
  ) {
    const logEntry = { statusCode, url, body, timestamp: new Date() };
    this.recentLogs.push({ type: "Response Details : ", ...logEntry });
    console.log("Logged Response:", logEntry);
  }

  getRecentLogs() {
    const logs = this.recentLogs
      .map((log) => {
        return {
          [`==========${log.type}=====\n${JSON.stringify(log.data, null, 4)}=====`]:
            log,
        };
      })
      .join("\n\n");
    return logs;
  }
}
