import jwt from "jsonwebtoken";

export const authenticationMiddleware = async function (req, res, next) {
  try {
    const tokenHeader = req.headers["authorization"]; //try to read the headers
    //id header not exist then send
    if (!tokenHeader) {
      console.log("⚠️ No Authorization header found");
      return next(); // proceed without login
    }

    if (!tokenHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "authorization header must statr with Bearer " });
    }
    const token = tokenHeader.split(" ")[1];
    console.log("Extracted token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};

//here now i can create one more middle ware
//middleware insure that tou have to be login
export const ensureAuthentication = function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "You must be authenticated" });
  }
  next();
};

//this is for authotization purpose

export const restrictToUser = function (role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res
        .status(401)
        .json({ error: "You are not authorized to access this resource" });
    }
    next();
  };
};
