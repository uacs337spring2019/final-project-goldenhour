"use strict";

const express = require('express');
const app = express();
var mysql = require('mysql');

app.use(express.static('public'));
console.log("Service Started");

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let params = req.query;

    var mode = params.mode;

    if (mode == undefined) {
        res.status(400);
        res.send("Missing required parameters");
    }
    
});


app.listen(process.env.PORT);