const expressJwt = require("express-jwt");
const api = process.env.API_URL;

async function isRevoked(req, payload, done) {
  const data = await payload.isAdmin;
  if (!data) {
    done(null, true);
  }
  done();
}

function authJwt() {
  const secret = process.env.JWT_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

module.exports = authJwt;
