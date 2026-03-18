//Create and send token and save in the cookie
const sendToken = (user, statusCode, res) => {
  //Create Jwt token
  const token = user.getJwtToken();
  const isProduction =
    String(process.env.NODE_ENV || "development").trim().toLowerCase() ===
    "production";
  const cookieExpirationDays = Number(process.env.COOKIE_EXPIRATION) || 7;

  //Options for cookie
  const options = {
    expires: new Date(
      Date.now() + cookieExpirationDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
