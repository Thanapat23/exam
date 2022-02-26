const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync(__dirname + '/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '172.28.240.1',
    user: 'Benz',
    password: '3743',
    database: 'final'
});
// show data
app.get('/data', function (req, res) {
    console.log("Hello in /data ");
    let sql = 'SELECT l.*,c.district_name FROM local l, cmdistrict c WHERE l.district_id = c.id;';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//district
app.get('/cmdistrict', function (req, res) {
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM cmdistrict;';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//delete
app.put('/delete', function (req, res) {
    var sql = 'DELETE FROM local WHERE id = ?';
    db.query(sql, [req.body.idkey], function (error, results) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function (req, res) {
    var sql = 'UPDATE local SET firstname = ? , lastname = ? , district_id = ? WHERE id = ?';
    db.query(sql, [req.body.firstname, req.body.lastname, req.body.district_id, req.body.idkey], function (error, results) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function (req, res) {
    console.log(req.body);
    let data = {
        id: req.body.idkey,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        district_id: req.body.district,
        email: req.body.email
    };
    let sql = 'INSERT INTO local SET ?';
    db.query(sql, data, (err, result) => {
        if (err) {
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        } else {
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
