const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).send({
      message:
        "Auth token not set."
    })
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).send({
        message:
          "The auth token is invalid."
      })
    }

    req.user = user.user
    next()
  })
}