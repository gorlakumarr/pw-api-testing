import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";
import { APILogger } from "../utils/logger";
import { create } from "node:domain";
import { createToken } from "../helper/create-token";

let authToken: string;

test.beforeAll("Setup before all tests", async ({ api, config }) => {
  // const tokenResponse = await api
  //   .path("/users/login")
  //   .body({
  //     user: { email: config.userEmail, password: config.userPassword },
  //   })
  //   .postRequest(200);
  // authToken = "Token " + tokenResponse.user.token;
  authToken = await createToken(config.userEmail, config.userPassword);
  console.log("Token is created");
});

test("Get Articles - Fixtures", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(response.articles.length).toEqual(10);
  expect(response.articles.length).shouldEqual(10);
  expect(response.articles.length).toBeLessThanOrEqual(10);

  // .url("https://conduit-api.bondaracademy.com/api")
  // .path("/articles")
  // .params({ userId: 1, pass: 2 })
  // .headers({ "Content-Type": "application/json" })
  // .body({ title: "foo", body: "bar", userId: 1 })
  // .getURL();
});

test("Get Tags - Fixtures", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);

  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("Create & Delete Article ", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Test One Title1",
        description: "Test One About",
        body: "Test One Description",
        tagList: ["No Tags"],
      },
    })
    .postRequest(201);

  expect(createArticleResponse).not.toBeNull();
  expect(createArticleResponse.article.title).toEqual("Test One Title1");
  const slug = createArticleResponse.article.slug;

  const updateArticleResponse = await api
    .path("/articles/" + slug)
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Test One Title2",
        description: "Test One About",
        body: "Test One Description",
        tagList: ["No Tags"],
      },
    })
    .putRequest(200);

  expect(updateArticleResponse).not.toBeNull();
  expect(updateArticleResponse.article.title).toEqual("Test One Title2");
  const newslug = updateArticleResponse.article.slug;

  const getArticlesResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(getArticlesResponse.articles[0].title).toEqual("Test One Title2");

  await api
    .path("/articles/" + newslug)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  const getArticlesResponseTwo = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(getArticlesResponseTwo.articles[0].title).not.toEqual(
    "Test One Title2",
  );
});

test("Logger Test", () => {
  const logger = new APILogger();
  logger.logRequest(
    "GET",
    "/articles",
    { "Content-Type": "application/json" },
    null,
  );
  logger.logResponse(
    200,
    "/articles",
    { "Content-Type": "application/json" },
    { articles: [] },
  );
  const recentLogs = logger.getRecentLogs();
});
function customExpect(length: any) {
  throw new Error("Function not implemented.");
}
