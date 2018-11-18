import Feed from "../../models/feeds";
import { feed as feedValidator } from "./validators";
import { idValidator } from "../../utils/model";

export async function create(ctx) {
  const { user } = ctx.state;

  const params = ctx.request.smartParams;

  const error = feedValidator(params);
  if (error) {
    ctx.throw(400, error);
  }

  const entityFields = {
    ...params,
    creator: user._id
  };

  const entity = new Feed(entityFields);
  await entity.save();
  ctx.body = {
    feed: await Feed.populate(entity, {
      path: "creator",
      select: "displayName"
    })
  };
}

export async function get(ctx) {
  const entities = await Feed.find().populate({
    path: "creator",
    select: "displayName"
  });
  ctx.body = {
    feeds: entities
  };
}

export async function getOne(ctx, next) {
  const { id } = ctx.request.smartParams;

  if (idValidator(id)) {
    ctx.throw(400, "Bad news item ID");
  }

  const entity = await Feed.findById(id).populate({
    path: "creator",
    select: "displayName"
  });

  if (!entity) {
    ctx.throw(404, "News item not found");
  }

  ctx.body = {
    feed: entity
  };

  if (next) {
    return next();
  }
}

export async function update(ctx) {
  const params = ctx.request.smartParams;
  const { user } = ctx.state;
  const { feed } = ctx.body;

  const error = feedValidator(params);
  if (error) {
    ctx.throw(400, error);
  }

  if (!feed.creator.equals(user._id)) {
    ctx.throw(403, "Not authorized to edit this news item");
  }

  Object.assign(feed, params);
  await feed.save();
  ctx.body = {
    feed
  };
}

export async function remove(ctx) {
  const { user } = ctx.state;
  const { feed } = ctx.body;

  if (!feed.creator.equals(user._id)) {
    ctx.throw(403, "Not authorized to delete this news item");
  }

  await feed.remove();

  ctx.body = {
    _id: feed._id
  };
}
