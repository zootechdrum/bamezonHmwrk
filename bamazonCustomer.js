var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var table;

console.log(process.argv)


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
  connectionLimit: 10,
  // Your password
  password: "password",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected!!");
});




var query = "SELECT * FROM products";

function displayTable() {
  console.log(table.toString())
}

function insertTable() {
  connection.query(query, function (err, res) {
    console.log(res)
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
  connection.query("SELECT item_id,stock_quantity,price FROM products", function (err, results) {
    if (err) throw err

    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "What is the item_ID of the item you would like to purchase? [ QUIT WITH Q ]",
          validate: function(value) {
            if (value !== "Q") {
              return true;
            }else{
            process.exit()
            return
            }
          }
        },
        {
          name: "qty",
          type: "input",
          message: "How much would you like to buy ?",
        },
        
      ])

      .then(function (answer) {
        console.log(answer)
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
          console.log("Your total is : $" + answer.qty * chosenItem.price + ".00 USD")
          console.log("------------------------")
          insertTable()

        }

      })
  })
}

// Displays message before exiting the application
process.on('exit', function(code) {
  console.log("\r\n -------------------------------------")
  console.log("\r\n Thank you for visiting Bamazon.")
  console.log("\r\n Come back soon")
  console.log("-------------------------------------")
})

createTable()
insertTable()



