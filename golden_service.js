"use strict";

const express = require('express');
const mysql = require('mysql');
const path = require("path");
const fs = require("fs");

const app = express();


app.use(express.static('public'));
console.log("Service Started");

app.get('/', express.static(path.join(__dirname, "./public")));

const multer = require("multer");

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops, something went wrong!");
};

const upload = multer({
    dest: "/sunsetpics"
});

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let params = req.query;

    var mode = params.mode;

    if (mode == undefined) {
        res.status(400);
        res.send("Missing required parameters");
    }
    
});


app.listen(process.env.PORT || 3000);