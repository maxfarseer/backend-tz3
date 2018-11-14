export function idValidator(id) {
  return /^[0-9a-fA-F]{24}$/.test(id) ? null : { _id: "Incorrect id" };
}
