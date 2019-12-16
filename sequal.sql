DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(45) DEFAULT '' NOT NULL,
    price INT default 0,
    stock_quantity INT default 0,
    PRIMARY KEY (item_id)
);