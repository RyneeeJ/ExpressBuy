const BlacklistedToken = require("../models/blacklistedTokenModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const getUserFromToken = async ({ token, isDetailed = false }) => {
  if (!token) return isDetailed ? { user: null, reason: "no_token" } : null;

  const isTokenBlacklisted = await BlacklistedToken.findOne({ token });
  if (isTokenBlacklisted)
    return isDetailed ? { user: null, reason: "blacklisted" } : null;

  try {
    // validate jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user still exists
    const user = await User.findById(decoded.id).select("role");

    if (!user)
      return isDetailed ? { user: null, reason: "user not found" } : null;

    const changedAfter = user.passwordChangedAfterTokenIssued(decoded.iat);

    if (changedAfter)
      return isDetailed ? { user: null, reason: "password_changed" } : null;

    return isDetailed ? { user } : user;
  } catch {
    return isDetailed ? { user: null, reason: "jwt_invalid" } : null;
  }
};

module.exports = getUserFromToken;
