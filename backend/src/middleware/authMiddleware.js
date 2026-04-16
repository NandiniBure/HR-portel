import jwt from "jsonwebtoken";

// Authentication middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodewd",decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Role-based access middleware
export const authorizeRoles = (...allowedRoles) => {
  console.log("---->", allowedRoles);
  return (req, res, next) => {
    console.log("===>", req.user);
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Role not assigned to user" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};
