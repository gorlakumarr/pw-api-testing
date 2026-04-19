import { test, expect } from "@playwright/test";
import { Assert } from "assert";

test("@project:smoke Sample Test - Tags ", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );
  const tagsResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual("Test");
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});

test("@project:regression Sample Test - Articles", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  );
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toEqual(10);
});

test("@project:regression Sample Test - Create & Delete Article", async ({
  request,
}) => {
  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "gorlakumarr@gmail.com", password: "BlueBag@1997" },
      },
    },
  );
  const tokenResponseJSON = await tokenResponse.json();
  const authToken = "Token " + tokenResponseJSON.user.token;
  console.log(authToken);

  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      data: {
        article: {
          title: "Test One Title",
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
  expect(createArticleResponseJSON.article.title).toEqual("Test One Title");
  const slug = createArticleResponseJSON.article.slug;
  console.log(
    "createArticleResponseJSON" + JSON.stringify(createArticleResponseJSON),
  );
  console.log("------------------------------/n");

  // const articlesResponse = await request.get(
  //   "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  //   {
  //     headers: {
  //       Authorization: authToken,
  //     },
  //   },
  // );
  // const articlesResponseJSON = await articlesResponse.json();
  // console.log("articlesResponseJSON" + JSON.stringify(articlesResponseJSON));
  // expect(articlesResponseJSON.articles[0].title).toEqual("Test One Title");
  // const slug = articlesResponseJSON.articles[0].slug;
  // console.log("slug" + slug);

  const deleteResponse = await request.delete(
    "https://conduit-api.bondaracademy.com/api/articles/" + slug,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );

  expect(deleteResponse.status()).toEqual(204);
});

test("@project:regression Sample Test - Create, Update  & Delete Article", async ({
  request,
}) => {
  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "gorlakumarr@gmail.com", password: "BlueBag@1997" },
      },
    },
  );
  const tokenResponseJSON = await tokenResponse.json();
  const authToken = "Token " + tokenResponseJSON.user.token;
  console.log(authToken);

  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      data: {
        article: {
          title: "Test Two Title",
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
  expect(createArticleResponseJSON.article.title).toEqual("Test Two Title");
  console.log(createArticleResponseJSON);

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
          title: "Test Two Title Updated",
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
  console.log("putResponse " + JSON.stringify(putResponseJSON));
  const newslug = putResponseJSON.article.slug;
  console.log("newslug" + newslug);

  const deleteResponse = await request.delete(
    "https://conduit-api.bondaracademy.com/api/articles/" + newslug,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );

  expect(deleteResponse.status()).toEqual(204);
});
