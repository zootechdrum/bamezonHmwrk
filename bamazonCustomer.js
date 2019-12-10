var mysql  = require('mysql');
var inquirer = require('inquirer');

//Required to connect to our database on Local server
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon_DB"
  });

  connection.connect(function(err) {
  if (err) throw err;
  console.log("Database is connected!!");
});