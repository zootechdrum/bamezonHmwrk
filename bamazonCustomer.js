var mysql  = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var table = new Table({

  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
  head: ['item_id','product_name','department','price','quantity']
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

  connection.connect(function(err) {
  if (err) throw err;
  console.log("Database is connected!!");
});

var query = "SELECT * FROM products"

function showTable() {
connection.query(query, function(err, res){
  if (err) throw err;

  console.log(res)
  for( var i = 0; i < res.length; i++){
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
  connection.query("SELECT item_id FROM products", function(err,results){
    if (err) throw err
    console.log(results)
  })
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
    
    .then(function (answer){
      var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";

    })

  }

  function bidAuction() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM auctions", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].item_name);
              }
              return choiceArray;
            },
            message: "What auction would you like to place a bid in?"
          },
          {
            name: "bid",
            type: "input",
            message: "How much would you like to bid?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].item_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
          if (chosenItem.highest_bid < parseInt(answer.bid)) {
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE auctions SET ? WHERE ?",
              [
                {
                  highest_bid: answer.bid
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Bid placed successfully!");
                start();
              }
            );
          }
          else {
            // bid wasn't high enough, so apologize and start over
            console.log("Your bid was too low. Try again...");
            start();
          }
        });
    });
  }




showTable();

