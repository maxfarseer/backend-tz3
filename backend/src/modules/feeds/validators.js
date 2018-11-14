export function feed(params) {
  let error = null;
  if (!params.title) {
    error = "Title must not be empty";
  }

  if (!params.content) {
    error = "Content must not be empty";
  }

  return error;
}
