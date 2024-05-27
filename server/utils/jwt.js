import jwt from "jsonwebtoken";

export function getToken(data) {
  return jwt.sign(data, process.env.SECRET_ACCESS_KEY, {
    expiresIn: "24hr",
  });
}
