var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({

  chars: {
    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
    , 'right': '║', 'right-mid': '╢', 'middle': '│'
  },
  head: ['item_id', 'product_name', 'department', 'price', 'quantity']
});


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

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected!!");
});

var query = "SELECT * FROM products"

function showTable() {
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log(res)
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity]
      )
    }
    console.log(table.toString())
    whatToBuy()
  })
}

function whatToBuy() {
  connection.query("SELECT item_id,stock_quantity FROM products", function (err, results) {
    if (err) throw err

    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "What is the item_ID of the item you would like to purchase?",
        },
        {
          name: "qty",
          type: "input",
          message: "How much would you like to buy ?",
        }
      ])

      .then(function (answer) {
        var chosenItem;

        for (var i = 0; i < results.length; i++) {
          console.log(results[i].item_id + " " + answer.id)
          if (parseInt(results[i].item_id) === parseInt(answer.id)) {
            chosenItem = results[i]
          }

        }
        console.log(chosenItem)
        if (chosenItem.stock_quantity < answer.qty) {
          console.log("-----------------------------------------")
          console.log("Insufficient quantity to place your order")
          console.log("-----------------------------------------")
        }

      })
  })
}

showTable();

