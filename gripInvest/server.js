const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');
const gripInvest = require('./route');
var app = express();
const server = http.createServer(app);
const port_no = 3060;
// Please change db connections credentials according to you.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'sultan',
    password: 'sultan246',
    database: 'gripInvest'
});
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/gripInvest',gripInvest);
app.use(fileUpload());
app.get("/", (req, res) => res.send("OK")); // this is for the testing purpose
app.set('0.0.0.0');
server.listen(port_no, (err) => {
    if (err) console.log("Unable to start server");
    else console.log(`Server is up on port ${port_no}!`);
});