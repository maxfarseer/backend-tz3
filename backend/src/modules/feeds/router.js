import { ensureUser } from "../../middleware/validators";
import { prepareParams, extract } from "../../middleware/smartRequest";

import * as actions from "./controller";

export const baseUrl = "/api/v1/feeds";

export default [
  {
    method: "POST",
    route: "/",
    handlers: [
      ensureUser,
      prepareParams(ctx => extract(ctx.request.body)(["title", "content"])),
      actions.create
    ]
  },
  {
    method: "GET",
    route: "/",
    handlers: [actions.get]
  },
  {
    method: "GET",
    route: "/:id",
    handlers: [
      prepareParams(ctx => extract(ctx.params)(["id"])),
      actions.getOne
    ]
  },
  {
    method: "PUT",
    route: "/:id",
    handlers: [
      ensureUser,
      prepareParams(ctx => ({
        ...extract(ctx.params)(["id"]),
        ...extract(ctx.request.body)(["title", "content"])
      })),
      actions.getOne,
      actions.update
    ]
  },
  {
    method: "DELETE",
    route: "/:id",
    handlers: [
      ensureUser,
      prepareParams(ctx => extract(ctx.params)(["id"])),
      actions.getOne,
      actions.remove
    ]
  }
];
