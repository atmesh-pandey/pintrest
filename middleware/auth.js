const jwt = require("jsonwebtoken");

function authorizeUser(req, res, next) {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication token not found" });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key

    // Attach user info to the request object
    req.token = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authorization Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authorizeUser;
