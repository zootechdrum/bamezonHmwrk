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
  whatToDo()
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


function displayTable() {
  console.log(table.toString())
}



function whatToDo() {
inquirer
  .prompt({
      message:"What would you like to do?",
      name : 'action',
      type: 'list',
      choices:[
        new inquirer.Separator(),
      'View Products for Sale',
      new inquirer.Separator(),
     'View Low Inventory',
     new inquirer.Separator(),
      'Add to Inventory'
    ]
  })
  .then( function(answer) {
    action(answer.action)
  })

  function displayTable() {
    console.log(table.toString())
  }
}

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
      lowInv()
      break;

      case 'Add to Inventory':
      addInv();
      break;

    }
  }

  function forSale() {
    var query = "SELECT * FROM products";

    connection.query(query, function (err, res) {
      if (err) throw err;
      createTable(res)
    })
  }

  function lowInv(){
    var query = "Select * from products WHERE stock_quantity < 5";

    connection.query(query, function (err, res) {
      if (err) throw err;
      createTable(res)
    })
  }

  function addInv() {
    inquirer
  .prompt(
    {
      message:"What item would you like to update?",
      name : 'item',
      type: 'input',    
  },
  {
      message:"Enter Qty",
      name : 'qty',
      type: 'input',  
  }

)
  .then( function(answer) {
    action(answer.action)
  })
    
  }
