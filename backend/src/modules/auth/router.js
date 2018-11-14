import * as auth from "./controller";
import { prepareParams, extract } from "../../middleware/smartRequest";

export const baseUrl = "/api/v1/auth";

export default [
  {
    method: "POST",
    route: "/",
    handlers: [auth.authUser]
  },
  {
    method: "POST",
    route: "/google",
    handlers: [
      prepareParams(ctx => extract(ctx.request.body)(["token"])),
      auth.googleAuth
    ]
  }
];
