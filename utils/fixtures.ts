import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { request } from "https";
import { APILogger } from "./logger";
import { setCustomerExpectLogger } from "./custom-expect";

export type Fixtures = {
  api: RequestHandler;
};

export const test = base.extend<Fixtures>({
  api: async ({request}, use) => {
    const baseURL = "https://conduit-api.bondaracademy.com/api";
    const logger = new APILogger();
    setCustomerExpectLogger(logger);
    const requesthandler = new RequestHandler(request,baseURL, logger);
    await use(requesthandler);
  },
});
