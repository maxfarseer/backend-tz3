import Koa from "koa";
import bodyParser from "koa-bodyparser";
import convert from "koa-convert";
import logger from "koa-logger";
import mongoose from "mongoose";
import cors from "koa-cors";
import setUpPassport from "../src/middleware/passport";
import { errorMiddleware } from "../src/middleware";
import config from "../config";
import modules from "../src/modules";

console.log("🐝 Starting", config);

const app = new Koa();

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(
    `mongodb://${config.database.host}/${config.database.databaseName}`,
    config.database.options
  );
}

app.use(cors());

app.use(convert(logger()));
app.use(bodyParser());
app.use(errorMiddleware());

const passport = setUpPassport(config);

app.use(passport.initialize());

modules(app);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server started on ${config.port}`);
  });
}

export default app;
