"use strict";

const express = require('express');
const http = require("http");
const mysql = require('mysql');
const path = require("path");
const fs = require("fs");

const app = express();
const httpServer = http.createServer(app);


app.use(express.static('public'));

console.log("Service Started");

app.get('/', express.static(path.join(__dirname, "./public")));

const multer = require("multer");

const multerConf = {
    storage : multer.diskStorage({
        destination: function(req, file, next){
            next(null, './public/pics');
        },
        filename: function(req, file, next) {
            const ext = file.mimetype.split('/')[1];
            next(null,file.fieldname + '-' + Date.now() + '.' + ext);
        } 
    }),
    fileFilter: function(req, file, next) {
        if (!file) {
        next();
        }
        const image = file.mimetype.startsWith('image/');
        if(image){
        next(null,true);
        } else {
        next({message:"File type not supported"}, false);
        }
    }
};

app.post('/upload', multer(multerConf).single('photo'), function(req, res) {
    if (req.file) {
        req.body.photo = req.file.filename;
        console.log(req.body);
        // req.body.name
        // req.body.place
        // req.body.photo
        // we have to store this in the database
    }
    
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

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });