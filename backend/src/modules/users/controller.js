import User from "../../models/users";
import { user as userValidator } from "./validators";
import { idValidator } from "../../utils/model";

export async function createUser(ctx) {
  const userData = ctx.request.smartParams;
  const alredyExistentUser = await User.find({ username: userData.username });
  // TODO Add validation

  const error = userValidator(userData);

  if (error) {
    ctx.throw(400, error);
  }

  if (alredyExistentUser.length > 0) {
    ctx.throw(400, "User already exists");
  }

  try {
    const user = new User({
      ...userData,
      displayName: userData.username
    });
    await user.save();
    const token = user.generateToken();

    ctx.body = {
      token
    };
  } catch (err) {
    ctx.throw(400, err.message);
  }
}

export async function getUser(ctx) {
  const { id } = ctx.request.smartParams;

  if (idValidator(id)) {
    ctx.throw(404, "User not found");
  }

  const entity = await User.findById(id, "-password");

  if (!entity) {
    ctx.throw(404, "User not found");
  }

  ctx.body = {
    user: entity
  };
}
