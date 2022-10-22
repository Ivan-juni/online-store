const jwt = require("jsonwebtoken");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = rew.headers.authorization.split(" ")[1]; // Bearer gfhdfhdhd
      if (!token) {
        return res.status(401).json({ message: "User isn't authorized" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "You haven't access" });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "User isn't authorized" });
    }
  };
};