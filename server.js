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
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
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


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello, this is the TesteSS - Teste to Job in SouthSystem NodeJS Oportunity :o)" });
});
app.use('/images', express.static('uploads'));
//routes
require('./app/routes/auth.routes')(app);

require('./app/routes/product.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

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