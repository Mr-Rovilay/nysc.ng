import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ error: "Invalid token" });
    }
    req.decoded = user;
    next();
  });
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyJWT(req, res, () => {
    if (req.decoded.id === req.params.id || req.decoded.isAdmin) {
      next();
    } else {
      return res.status(403).send({ error: "You are not authorized" });
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyJWT(req, res, () => {
    if (req.decoded.isAdmin) {
      next();
    } else {
      return res.status(403).send({ error: "Only Admin is authorized" });
    }
  });
};
