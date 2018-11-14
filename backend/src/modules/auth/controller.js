import passport from "koa-passport";
import axios from "axios";
import config from "../../../config";
import User from "../../models/users";

export async function authUser(ctx, next) {
  return passport.authenticate("local", user => {
    if (!user) {
      ctx.throw(401, "Bad credentials");
    }

    const token = user.generateToken();

    ctx.body = {
      token
    };
  })(ctx, next);
}

export async function googleAuth(ctx) {
  const { token } = ctx.request.smartParams;

  let response;
  try {
    response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
    );
  } catch (error) {
    if (error.response) {
      ctx.throw(401, error.response.data.error_description);
    } else {
      ctx.throw(500, "Error on server while verifying token");
    }
  }

  const { data } = response;

  if (config.google.clientID !== data.aud) {
    ctx.throw(401, "Bad Google cliend ID");
  }

  const existentUsers = await User.find({ googleId: data.sub });
  let user;
  if (!existentUsers.length > 0) {
    user = new User({
      username: `__google_${data.sub}`,
      googleId: data.sub,
      displayName: data.name
    });
    await user.save();
  } else {
    user = existentUsers[0];
  }

  const accessToken = user.generateToken();

  ctx.body = {
    token: accessToken
  };
}
