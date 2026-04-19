import { request } from "@playwright/test";
import { config } from "../api-test.config";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";

export async function createToken(email: string, password: string) {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.apiBaseURL, logger);

  try {
    const tokenResponse = await api
      .path("/users/login")
      .body({
        user: { email: email, password: password },
      })
      .postRequest(200);
    console.log("Token is created");
    return "Token " + tokenResponse.user.token;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createToken);
    }
    throw error;
  } finally {
    await context.dispose();
  }
}
