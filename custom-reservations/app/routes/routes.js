module.exports = app => {
  const colleagues = require("../controllers/colleagues.controller.js");
  const reservations = require("../controllers/reservations.controller.js");
  const authentication = require("../controllers/authentication.controller.js");
  const nibolAuthentication = require("../controllers/nibolAuthentication.controller.js");
  const authMiddleware = require("../middleware/firebase-auth.middleware.js");

  var router = require("express").Router();

  // List colleagues in office
  router.get("/colleagues", authMiddleware, colleagues.list);

  router.get("/reservations", authMiddleware, reservations.list);
  router.post("/reservations", authMiddleware, reservations.create);
  router.delete("/reservations", authMiddleware, reservations.delete);

  router.get('/test', authMiddleware, authentication.test);

  router.get("/user", authMiddleware, authentication.get);
  //router.put("/user", authMiddleware, authentication.update);

  router.post("/nibol_token", authMiddleware, nibolAuthentication.setNibolToken);
  router.post("/nibol_pass", authMiddleware, nibolAuthentication.retireveNibolTokenFromPassword);

  app.use('/api', router);
};
