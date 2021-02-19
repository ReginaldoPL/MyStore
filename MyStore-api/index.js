const express = require("express");

const app = require('./server.js')


const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");

const db = require("./app/models");
const Role = db.role;
const User = db.user;
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

// simple route
app.get("/", (req, res) => {
    res.json({ message: `Hello, this is the MyStore-API` });
});
app.use('/images', express.static('uploads'));
//routes
require('./app/routes/auth.routes')(app);

require('./app/routes/product.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 7500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Banco ${dbConfig.URI} `);
});