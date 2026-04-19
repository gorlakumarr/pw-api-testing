import { userInfo } from "node:os";

const ProcessENV = process.env.TEST_ENV || "dev";
console.log(`Running tests on ${ProcessENV} environment`);

const config = {
  apiBaseURL: "https://conduit-api.bondaracademy.com/api",
  userEmail: "gorlakumarr@gmail.com",
  userPassword: "BlueBag@1997",
};

if (ProcessENV === "prod") {
  config.apiBaseURL = "https://conduit.productionready.io/api";
  config.userEmail = "your_production_email@example.com";
  config.userPassword = "your_production_password";
} else if (ProcessENV === "staging") {
  config.apiBaseURL = "https://conduit-staging.bondaracademy.com/api";
  config.userEmail = "your_staging_email@example.com";
  config.userPassword = "your_staging_password";
}

export { config };
