module.exports = app => {
  const colleagues = require("../controllers/colleagues.controller.js");
  const reservations = require("../controllers/reservations.controller.js");
  const authentication = require("../controllers/authentication.controller.js");
  const nibolAuthentication = require("../controllers/nibolAuthentication.controller.js");
  const authMiddleware = require("../middleware/auth.middleware.js");

  var router = require("express").Router();

  // List colleagues in office
  router.get("/colleagues", authMiddleware, colleagues.list);

  router.get("/reservations", authMiddleware, reservations.list);

  router.get("/login", authentication.login);
  router.get("/auth", authentication.auth);
  router.put("/user", authMiddleware, authentication.update);

  router.post("/nibol_token", authMiddleware, nibolAuthentication.setNibolToken);
  router.post("/nibol_pass", authMiddleware, nibolAuthentication.retireveNibolTokenFromPassword);

  app.use('/api', router);
};
