var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var table;
function createTable() {
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

function displayTable() {
  console.log(table.toString())
}

function insertTable() {
  connection.query(query, function (err, res) {
    if (err) throw err;
    if (table.length > 1){
      table = []
      createTable()
    }
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity]
      )
    
  }
    whatToBuy()
    displayTable()
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
          if (parseInt(results[i].item_id) === parseInt(answer.id)) {
            chosenItem = results[i]
          }

        }
        if (chosenItem.stock_quantity < answer.qty) {
          console.log("-----------------------------------------")
          console.log("Insufficient quantity to place your order")
          console.log("-----------------------------------------")
        } else {

          var total =  chosenItem.stock_quantity - answer.qty
          connection.query(
            "UPDATE products SET ? WHERE ?", 
            [
              {
                stock_quantity : total
              },
              {
                item_id: parseInt(answer.id)
              }
            ],
            function(error) {
              if (error) throw error;
            }
          )
          console.log("------------------------")
          console.log("Order has been placed!!")
          console.log("------------------------")
          insertTable()
        }

      })
  })
}
createTable()
insertTable()

// if (chosenItem.highest_bid < parseInt(answer.bid)) {
//   // bid was high enough, so update db, let the user know, and start over
//   connection.query(
//     "UPDATE auctions SET ? WHERE ?",
//     [
//       {
//         highest_bid: answer.bid
//       },
//       {
//         id: chosenItem.id
//       }
//     ],
//     function(error) {
//       if (error) throw err;
//       console.log("Bid placed successfully!");
//       start();
//     }
//   );
// }
// else {
//   // bid wasn't high enough, so apologize and start over
//   console.log("Your bid was too low. Try again...");
//   start();
// }
// });
// });
// }


