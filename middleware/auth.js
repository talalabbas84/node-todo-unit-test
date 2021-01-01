const { OAuth2Client } = require('google-auth-library');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  if (!payload) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
  try {
    //Verify token
    req.user = payload;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});
