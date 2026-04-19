import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
  private request: APIRequestContext;
  private baseURL: string = "";
  private defaultBaseURL: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apibody: object = {};
  private logger: APILogger;

  constructor(
    request: APIRequestContext,
    apiBaseURL: string,
    logger: APILogger,
  ) {
    this.request = request;
    this.defaultBaseURL = apiBaseURL;
    this.logger = logger;
  }

  url(url: string) {
    this.baseURL = url;
    return this;
  }
  path(path: string) {
    this.apiPath = path;
    return this;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }
  body(body: object) {
    this.apibody = body;
    return this;
  }

  async getRequest(statusCode: number) {
    const url = this.getURL();
    this.logger.logRequest("GET", url, this.apiHeaders, this.apibody);
    const response = await this.request.get(url, {
      headers: this.apiHeaders,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    this.logger.logResponse(
      response.status(),
      url,
      this.apiHeaders,
      responseJSON,
    );
    this.statusCodeValidator(response.status(), statusCode, this.getRequest);
    return responseJSON;
  }

  async postRequest(statusCode: number) {
    const url = this.getURL();
    this.logger.logRequest("POST", url, this.apiHeaders, this.apibody);
    const response = await this.request.post(url, {
      headers: this.apiHeaders,
      data: this.apibody,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    this.logger.logResponse(
      response.status(),
      url,
      this.apiHeaders,
      responseJSON,
    );
    this.statusCodeValidator(response.status(), statusCode, this.postRequest);
    return responseJSON;
  }

  async putRequest(statusCode: number) {
    const url = this.getURL();
    this.logger.logRequest("PUT", url, this.apiHeaders, this.apibody);
    const response = await this.request.put(url, {
      headers: this.apiHeaders,
      data: this.apibody,
    });
    const responseJSON = await response.json();
    this.logger.logResponse(
      response.status(),
      url,
      this.apiHeaders,
      responseJSON,
    );
    expect(response.status()).toBe(statusCode);
    this.statusCodeValidator(response.status(), statusCode, this.putRequest);
    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    const url = this.getURL();
    this.logger.logRequest("DELETE", url, this.apiHeaders, this.apibody);
    const response = await this.request.delete(url, {
      headers: this.apiHeaders,
    });
    this.logger.logResponse(response.status(), url, this.apiHeaders, null);
    this.statusCodeValidator(response.status(), statusCode, this.deleteRequest);
    expect(response.status()).toBe(statusCode);
  }

  getURL() {
    const url = new URL(
      `${this.baseURL || this.defaultBaseURL}${this.apiPath}`,
    );

    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  private statusCodeValidator(
    actualStatusCode: number,
    expectedStatusCode: number,
    callingMethod: Function
  ) {
    if (actualStatusCode !== expectedStatusCode) {
      const logs = this.logger.getRecentLogs();
      const error = new Error();
      error.message = `Expected status code ${expectedStatusCode} but received ${actualStatusCode}. Recent logs: ${logs}`;
      Error.captureStackTrace(error, callingMethod);
      throw error;
    }
  }
}
