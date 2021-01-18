const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const  checkDuplicateUsernameOrEmail = (req, res, next) => {
  if (!req.body.username || req.body.username.length==0){
    res.status(400).send({ message: "Failed! Username is empty!" });
      return;
  }
  if (!req.body.id &&  (!req.body.password || req.body.password.length==0)){
    res.status(400).send({ message: "Failed! password is empty!" });
      return;
  }
  if (!req.body.id &&  (!req.body.email || req.body.email.length==0)){
    res.status(400).send({ message: "Failed! email is empty!" });
      return;
  }
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }


    if (user && user.id != req.body.id) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }


      if (user && user.id != req.body.id) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;