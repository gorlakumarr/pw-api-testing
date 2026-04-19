import { test, expect, request } from "@playwright/test";
import { Assert } from "assert";

let authToken: string;

test.beforeAll("Setup before all tests", async ({ request }) => {
  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "gorlakumarr@gmail.com", password: "BlueBag@1997" },
      },
    },
  );
  const tokenResponseJSON = await tokenResponse.json();
  authToken = "Token " + tokenResponseJSON.user.token;
  console.log("Token is created");
});

// test.beforeEach("Setup before each test", async () => {
//   console.error("This will run before each test");
// });

// test.afterEach("Cleanup after each test", async () => {
//   console.error("This will run after each test");
// });

// test.afterAll("Cleanup after all tests", async () => {
//   console.error("This will run after all tests");
// });

test("Sample Test - Tags hooks", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );

  const tagsResponseJSON = await tagsResponse.json();
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual("Test");
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
  console.log("Sample Test - Tags is passed");
});

test("Sample Test - Articles hooks", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  );

  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toEqual(10);
  console.log("Sample Test - Articles is passed");
});

test("Sample Test - Create & Delete Article hooks", async ({ request }) => {
  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      data: {
        article: {
          title: "Test One Title 1",
          description: "Test One About",
          body: "Test One Description",
          tagList: ["No Tags"],
        },
      },
      headers: {
        Authorization: authToken,
      },
    },
  );

  const createArticleResponseJSON = await createArticleResponse.json();
  expect(createArticleResponse).not.toBeNull();
  expect(createArticleResponse.status()).toEqual(201);
  expect(createArticleResponseJSON.article.title).toEqual("Test One Title 1");
  const slug = createArticleResponseJSON.article.slug;

  const deleteResponse = await request.delete(
    "https://conduit-api.bondaracademy.com/api/articles/" + slug,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );

  expect(deleteResponse.status()).toEqual(204);
  console.log("Sample Test - Create & Delete Article is passed");
});

test("Sample Test - Create, Update  & Delete Article hooks", async ({
  request,
}) => {
  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      data: {
        article: {
          title: "Test Two Title 1",
          description: "Test Two About",
          body: "Test Two Description",
          tagList: ["No Tags"],
        },
      },
      headers: {
        Authorization: authToken,
      },
    },
  );

  const createArticleResponseJSON = await createArticleResponse.json();
  expect(createArticleResponse).not.toBeNull();
  expect(createArticleResponse.status()).toEqual(201);
  const slug = createArticleResponseJSON.article.slug;
  expect(createArticleResponseJSON.article.title).toEqual("Test Two Title 1");

  // const articlesResponse = await request.get(
  //   "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  //   {
  //     headers: {
  //       Authorization: authToken,
  //     },
  //   },
  // );
  // const articlesResponseJSON = await articlesResponse.json();
  // expect(articlesResponseJSON.articles[0].title).toEqual("Test Two Title");
  // const slug = articlesResponseJSON.articles[0].slug;
  // console.log("slug" + slug);

  const putResponse = await request.put(
    "https://conduit-api.bondaracademy.com/api/articles/" + slug,
    {
      data: {
        article: {
          title: "Test Two Title 1 Updated",
          description: "Test Two About",
          body: "Test Two Description",
          tagList: ["No Tags"],
        },
      },
      headers: {
        Authorization: authToken,
      },
    },
  );

  expect(putResponse.status()).toEqual(200);
  const putResponseJSON = await putResponse.json();
  const newslug = putResponseJSON.article.slug;

  const deleteResponse = await request.delete(
    "https://conduit-api.bondaracademy.com/api/articles/" + newslug,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );

  expect(deleteResponse.status()).toEqual(204);
  console.log("Sample Test - Create, Update & Delete Article is passed");
});
