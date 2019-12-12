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
      choices:['1','2','3']

    }
  ])
  .then(

  )