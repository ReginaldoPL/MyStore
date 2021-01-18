const express = require("express");

const app = require('./server.js')

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