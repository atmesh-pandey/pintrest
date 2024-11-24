// const jwt = require("jsonwebtoken");

// function authorizeUser(req, res, next) {
//   try {
//     // Extract the token from cookies
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Authentication token not found" });
//     }

//     // Decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key

//     // Attach user info to the request object
//     req.token = decoded;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error("Authorization Error:", error.message);
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// }

// module.exports = authorizeUser;


const jwt = require("jsonwebtoken");

function authorizeUser(req, res, next) {
  try {
    // Extract the token from cookies
    const token = req.cookies?.token || req.headers?.token;

    // Log for debugging (remove in production)
    console.log("Cookie Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Authentication token not found" });
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is properly set

    // Attach user info to res.locals for downstream middleware
    res.locals.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authorization Error:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // General error fallback
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authorizeUser;
