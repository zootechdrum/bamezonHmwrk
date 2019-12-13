var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var table;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",
  connectionLimit: 10,
  // Your password
  password: "password",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected!!");
});


function initTable() {
 table = new Table({

  chars: {
    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
    , 'right': '║', 'right-mid': '╢', 'middle': '│'
  },
  head: ['item_id', 'product_name', 'department', 'price', 'quantity']
});
}

inquirer
  .prompt([
    {
      name : 'action',
      type: 'list',
      choices:[
      'View Products for Sale',
      'View Low Inventory',
      'Add to Inventory'
    ],
      message: "What would you like to do?"
    }
  ])
  .then( function(answer) {
    action(answer.action)
  })

  function createTable(insertInfo) {
    table = [];
    initTable()
    for (var i = 0; i < insertInfo.length; i++) {
      table.push(
        [insertInfo[i].item_id,
        insertInfo[i].product_name,
        insertInfo[i].department_name,
        insertInfo[i].price,
        insertInfo[i].stock_quantity]
      )
    
  }
  displayTable()
  }

  function action(action) {

    switch(action) {
      case 'View Products for Sale':
      forSale();
      break;

      case 'View Low Inventory':
      break;

      case 'Add to Inventory':
      break;

    }
  }

  function forSale() {
    var query = "SELECT * FROM products WHERE stock_quantity > 0";

    connection.query(query, function (err, res) {
      if (err) throw err;
      createTable(res)
    })
  }

  function displayTable() {
    console.log(table.toString())
  }
  initTable()

  function lowInv(){
    var query = "Select * from products WHERE stock_quantity < 5"
  }
