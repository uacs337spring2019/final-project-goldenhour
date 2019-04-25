"use strict";

const express = require('express');
const crypto = require('crypto');
const http = require("http");
const path = require("path");
const app = express();
const httpServer = http.createServer(app);


app.use(express.static('public'));

console.log("Service Started");

const mysql = require('mysql');

var db_config = {
    host: "us-cdbr-iron-east-02.cleardb.net",
    database: "heroku_54e3f5c78405e67",
    user: "b072553315c851",
    password: "89afe3b2"
  };

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.get('/', express.static(path.join(__dirname, "./public")));

const multer = require("multer");
const multerConf = {
    storage : multer.diskStorage({
        destination: function(req, file, next){
            next(null, './public/pics');
        },
        filename: function(req, file, next) {
            const ext = file.mimetype.split('/')[1];
            next(null,file.fieldname + '-' + crypto.randomBytes(16).toString("hex") + '.' + ext);
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
        let name = req.body.name;
        let place = req.body.place;
        let photo = req.body.photo;
        
        let q = "INSERT INTO pictures VALUES ('"+photo+"', '"+name+"', '"+place+"')";
        connection.query(q, function(err,result) {
            if(err) throw err;
            console.log("File successfully saved!");
        })
        res.send("File successfully saved!");
    } else {
        res.send("Failed to upload image");
    }
});

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let params = req.query;
    var mode = params.mode;

    if (mode == undefined) {
        res.status(400);
        res.send("Missing required parameters");
    } else if (mode === "pics") {
        let q = "SELECT * from pictures";
        connection.query(q, function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
        })
    }
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });