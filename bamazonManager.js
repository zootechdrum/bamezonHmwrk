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


  function action(action) {

    switch(action) {
      case 'View Products for Sale':
      break;

      case 'View Low Inventory':
      break;

      case 'Add to Inventory':
      break;

    }

    console.log(action)
  }