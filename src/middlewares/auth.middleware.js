const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(authHeader, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.userId = data.userId;
      next();
    });
  } catch {
    res.status(500).json({ error: "Error verifying the token" });
    next();
  }
};

module.exports = verifyToken;
