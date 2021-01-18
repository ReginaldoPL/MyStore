const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");

const path = require('path');


const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const User = db.user;

global.appRoot = path.resolve(__dirname);


db.mongoose
     .connect(dbConfig.URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

  app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
module.exports = app  
function initial() {
    Role.estimatedDocumentCount((err, count) => {
     
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
        new Role({
          name: "admin"
        }).save((err,roleAdmin) => {
          if (err) {
            console.log("error", err);
          }
          User.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new User({
                    username: "admin",
                    email: "reginaldo.pedro.de.lima@gmail.com",
                    password: bcrypt.hashSync("admin", 8),
                    roles: [roleAdmin._id]
                  }).save(err => {
                  if (err) {
                    console.log("error", err);
                  }
          
                  console.log("added 'user Admin' to roles collection");
                });
            }
        });
  
          console.log("added 'admin' to roles collection");
        });
      }
    });

   

  }
