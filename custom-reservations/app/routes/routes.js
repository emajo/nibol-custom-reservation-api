module.exports = app => {
  const authMiddleware = require("../middleware/auth.middleware.js")

  const authentication = require("../controllers/authentication.controller.js")
  const colleagues = require("../controllers/colleagues.controller.js")
  const nibolAuthentication = require("../controllers/nibolAuthentication.controller.js")
  const reservations = require("../controllers/reservations.controller.js")

  const router = require("express").Router()

  router.get("/colleagues", authMiddleware, colleagues.list)

  router.get("/reservations", authMiddleware, reservations.list)
  router.post("/reservations", authMiddleware, reservations.create)

  router.get("/login", authentication.login)
  router.get("/auth", authentication.auth)

  router.get("/user", authMiddleware, authentication.get)
  router.put("/user", authMiddleware, authentication.update)

  router.post("/nibol_token", authMiddleware, nibolAuthentication.setNibolToken)
  router.post("/nibol_pass", authMiddleware, nibolAuthentication.retireveNibolTokenFromPassword)

  app.use('/api', router)
};
