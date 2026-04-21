const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next){
  try {
    const authHeader = req.headers.authorization;
    console.log("checking token");
    
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyToken };