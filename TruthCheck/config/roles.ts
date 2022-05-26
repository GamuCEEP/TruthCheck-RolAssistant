export const roles = ["user", "admin"];
export const roleRights = new Map();
roleRights.set(roles[0], [
  "manageMe",
  "manageResources",
]);
roleRights.set(roles[1], [
  "manageMe",
  "manageResources",
  "manageUsers",
]);
