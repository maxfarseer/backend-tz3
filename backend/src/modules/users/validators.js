export function user(params) {
  let error = null;
  if (!params.username) {
    error = "Username must not be empty";
  }

  if (!params.password) {
    error = "Password must not be empty";
  }

  if (params.password && params.password.length < 6) {
    error = "Password must contain at least 6 characters";
  }

  return error;
}
