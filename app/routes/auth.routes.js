const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
 

  //add user
  app.post("/api/user",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  //update user
  app.put("/api/user",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.update
  );

  //list users
  app.get("/api/user",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    controller.list);

  //signin
  app.post("/api/auth/signin", controller.signin);
};