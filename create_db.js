var mysql = require('mysql');

var con = mysql.createConnection({
  host: "us-cdbr-iron-east-02.cleardb.net",
  database: "heroku_54e3f5c78405e67",
  user: "b072553315c851",
  password: "89afe3b2"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var q = "create table pictures ( \
          pic varchar(50) primary key, \
          name varchar(30), \
          place varchar(30));";

con.query(q, function(err, result) {
  if (err) throw err;
  console.log("Table Created");
})

