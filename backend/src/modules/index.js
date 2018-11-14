import Router from "koa-router";
import config from "../../config";

const { modules } = config;

export default function initModules(app) {
  const modulesDirs = modules.map(name => `${__dirname}/${name}`);

  modulesDirs.forEach(mod => {
    const router = require(`${mod}/router`); // eslint-disable-line import/no-dynamic-require

    const routes = router.default;
    const baseUrl = router.baseUrl;
    const instance = new Router({ prefix: baseUrl });

    routes.forEach(config => {
      const { method = "", route = "", handlers = [] } = config;

      const lastHandler = handlers.pop();

      instance[method.toLowerCase()](route, ...handlers, async ctx => {
        const result = await lastHandler(ctx);
        return result;
      });

      app.use(instance.routes()).use(instance.allowedMethods());
    });
  });
}
