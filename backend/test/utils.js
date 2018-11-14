import mongoose from 'mongoose'

export function cleanDb() {
  for (const collection in mongoose.connection.collections) {
    if (mongoose.connection.collections.hasOwnProperty(collection)) {
      mongoose.connection.collections[collection].remove();
    }
  }
}

export function closeConnection(connection) {
  return Promise.all([connection.disconnect(), mongoose.connection.close()]);
}

export async function authUser({ url = '/api/v1/auth', user, request }) {
  const response = await request
    .post(url)
    .send(user);

  const { token, user: userData } = response.body;
  return { token, user: userData };
}
