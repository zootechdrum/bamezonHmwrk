# Bamazon CLI App

![Image of working app](./images/working-demo-pic.png)

## Description
In this project, I be created an Amazon-like storefront with the MySQL,inquirer, Node, and CLI npm packages. The app can take in orders from customers and deplete stock from the store's inventory. I also have a file called bamazonManageer where a manager can see view producs for sale,  view low inventory, add to inventory, and add new products.

## Technologies Used 

1. Inquierer NPM package
2. CLI NPM package
3. MYSQL NPM package
4. Node.js

## How to Use
1. Clone this repo
2. Run the command `node <file>`
3. Start ordering or updating inventory

## Code Snippet

The below code is responsible for building a table and then calls on the function 
appropriatly named disiplayTable to show a visualization of where our current qty
is.

``` javascript
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

```

## What I learned

I learned that the NPM package CLI-table produces a beautiful table in the terminal.
It made this assigment much easier. I also re-learned some of the important queries I can 
make in MYSQL. This is something I have not done since I took Colt Steele's course on Udemy.

Here is my LinkedIn.




