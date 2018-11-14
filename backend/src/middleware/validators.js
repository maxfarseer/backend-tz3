import { verify } from "jsonwebtoken";
import recaptcha from "recaptcha-validator";
import config from "../../config";
import { getToken } from "../utils/auth";
import User from "../models/users";

export async function ensureUser(ctx, next) {
  const token = getToken(ctx);

  if (!token) {
    ctx.throw(401, "No token provided");
  }

  let decoded;
  try {
    decoded = verify(token, config.token);
  } catch (err) {
    ctx.throw(401, err.message);
  }

  ctx.state.user = await User.findById(decoded.id, "-password");
  if (!ctx.state.user) {
    ctx.throw(401, "User not found");
  }

  return next();
}

export async function ensureUserId(ctx, next) {
  const { id } = ctx.request.smartParams;

  const token = getToken(ctx);
  const decoded = verify(token, config.token);

  if (id !== decoded.id) {
    ctx.throw(403, "Not authorized to view profile");
  }

  return next();
}

export async function ensureRecaptcha(ctx, next) {
  if (
    process.env.NODE_ENV === "test" &&
    !ctx.request.body["g-recaptcha-response"]
  ) {
    return next();
  }

  const gRecaptchaResponse = ctx.request.body["g-recaptcha-response"];

  try {
    await recaptcha(
      config.recaptcha.siteSecret,
      gRecaptchaResponse,
      ctx.request.ip
    );
  } catch (err) {
    ctx.throw(401, "Captcha is not passed");
  }
  return next();
}
