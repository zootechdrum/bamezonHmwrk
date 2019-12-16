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

//Formats table
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

//displays the table
function displayTable() {
  console.log(table.toString())
}


// Prompts user for action to perform
function whatToDo() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      name: 'action',
      type: 'list',
      choices: [
        new inquirer.Separator(),
        'View Products for Sale',
        new inquirer.Separator(),
        'View Low Inventory',
        new inquirer.Separator(),
        'Add to Inventory',
        new inquirer.Separator(),
        'Add Product'
      ]
    })
    .then(function (answer) {
      action(answer.action)
    })

  function displayTable() {
    console.log(table.toString())
  }
}
//What should the table show
function createTable(insertInfo) {

  if (!insertInfo) {
    forSale()
  } else {

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
    whatToDo()
  }

}
//Performs a different function depending on user choice
function action(action) {

  switch (action) {
    case 'View Products for Sale':
      forSale();
      break;

    case 'View Low Inventory':
      lowInv()
      break;

    case 'Add to Inventory':
      addInv();
      break;

    case 'Add Product':
      addProd();
      break;

  }
}
//Checks all items for sale
function forSale() {
  var query = "SELECT * FROM products";

  connection.query(query, function (err, res) {
    if (err) throw err;
    createTable(res)
  })
}
//Check to see the low Inventory
function lowInv() {
  var query = "Select * FROM products WHERE stock_quantity < 5";

  connection.query(query, function (err, res) {
    if (err) throw err;
    createTable(res)
    
  })
}
//Adds to existing inventory
function addInv() {
  inquirer
    .prompt([
      {
        message: "What item would you like to update?",
        name: 'item',
        type: 'input',
      },
      {
        message: "Enter Qty",
        name: 'qty',
        type: 'input',
      }
    ])
    .then(function (answer) {
      connection.query("SELECT stock_quantity FROM products WHERE ?",
        { product_name: answer.item },
        function (err, qty) {
          connection.query("UPDATE products set ? WHERE ?",
            [
              {
                stock_quantity: parseInt(answer.qty) + parseInt(qty[0].stock_quantity)
              },
              {
                product_name: answer.item
              }
            ], function (err, res) {
              createTable()
            }
          )
        }
      )
    })
}

//Add Products to the table
function addProd() {
  inquirer
    .prompt([
      {
        message: "What is the name of the product to add?",
        name: 'item',
        type: 'input',
      },
      {
        message: "What category should this item be placed in?",
        name: 'category',
        type: 'list',
        choices: [
          new inquirer.Separator(),
          'Music',
          new inquirer.Separator(),
          'Clothing',
          new inquirer.Separator(),
          'Toys'
        ]
      },
      {
        message: "How much does it cost?",
        name: 'price',
        type: 'input',
      },
      {
        message: "How many do we have?",
        name: 'qty',
        type: 'input',
      },
    ])
    .then(function (answer) {
      connection.query("INSERT INTO products SET ?",
        [{
          product_name: answer.item,
          department_name: answer.category,
          price: answer.price,
          stock_quantity: answer.qty
        }
      ], function(err, res){
         if (err) throw err;
         console.log("-----------------------")
         console.log("-----------------------")
         console.log("Item added succesfully")
         console.log("-----------------------")
         console.log("-----------------------")
         forSale()
         
      })
    })

}


