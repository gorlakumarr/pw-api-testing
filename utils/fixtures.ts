import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { request } from "https";
import { APILogger } from "./logger";
import { setCustomerExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";

export type Fixtures = {
  api: RequestHandler;
  config: typeof config;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const logger = new APILogger();
    setCustomerExpectLogger(logger);
    const requesthandler = new RequestHandler(
      request,
      config.apiBaseURL,
      logger,
    );
    await use(requesthandler);
  },

  config: async ({}, use) => {
    await use(config);
  },
});
