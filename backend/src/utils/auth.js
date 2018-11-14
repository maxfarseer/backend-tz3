export function getToken(ctx) {
  const header = ctx.request.header["x-access-token"];
  if (!header) {
    return null;
  }

  return header;
}
