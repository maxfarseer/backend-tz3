export function prepareParams(getParams) {
  return async (ctx, next) => {
    ctx.request.smartParams = getParams(ctx);
    return next();
  };
}

export function extract(source) {
  return keys => {
    const result = {};
    for (const key of keys) {
      result[key] = source[key];
    }
    return result;
  };
}
