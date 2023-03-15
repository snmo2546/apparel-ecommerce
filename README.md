# Apparel E-commerce

An e-commerce site where customers can browse fashion items, add to cart and checkout with ECPay. While the owners can edit products, update inventories and manage orders.

This project is now live! Try it out at 👉 https://mysterious-waters-87170.herokuapp.com/index <br>

Use the default accounts below or register your own one!
<pre><code>(User) user1@example.com / 123 
(Admin) root@example.com / 12345678 (Route: /admin)</code></pre>

Fill in the card information below when checking out with ECPay
<pre><code>Card Number: 4311-9222-2222-2222
Expiration Date: Any future date (Format: MM/YY)
Verification Code: 222</code></pre>

## Features
### Customer
Browse Items
* Browse all items at a glance
* Browse items filtered by brands or categories
* Search items by keyword
* Browse specific item with detail information
* Add item to favorite list

Login
* Login locally
* Use Facebook or Google account to log in

Cart
* Add items to the cart
* View item name, size, price and subtotal
* Add or subtract quantity of cart items
* Delete cart items

Checkout
* View current cart items
* See fees and total amount of the order
* Enter shipment information

Payment
* Proceed payment process with ECPay

Account
* Browse all past orders
* Browse specific order with detail information
* Send messages to the admin

### Admin
Order management
* Browse all orders
* Browse specific order with detail information
* Send messages for customer service

Manage products, categories & brands
* Browse lists of products, categories and brands
* Create, edit or delete products, categories and brands
* Manage inventories

## Prerequisites
1. Git
2. Node.JS (v14.16.0 or above)
3. Express
4. MySQL

## Install
1. Clone this project to your local machine
<pre><code>$ git clone https://github.com/snmo2546/apparel-ecommerce.git</code></pre>
2. Find the directory and install dependencies
<pre><code>$ cd apparel-ecommerce
$ npm install</code></pre>
3. Create `.env` file to the directory<br>
Please check `.env.example` file for required data

## Third Party Payment
⚠ To proceed the payment process locally, use `ngrok` and run `ngrok http 3000`, then copy the url to `WEBSITE_URL` in `.env` file.

Fill in the card information below for testing
<pre><code>Card Number: 4311-9222-2222-2222
Expiration Date: Any future date (Format: MM/YY)
Verification Code: 222</code></pre>

For more information: [ECPay API Document](https://www.ecpay.com.tw/Content/files/ecpay011EN.pdf)

## Database Setup
1. Create database
<pre><code>DROP DATBASE IF EXISTS apparel_ecommerce;
CREATE DATABASE apparel_ecommerce;</code></pre>

2. Change password to your MySQL Workbench password in `config/config.json` file
<pre><code> "development": {
  "username": "root",
  "password": <YOUR MySQL Workbench Password>,
  "database": "apparel_ecommerce",
  "host": "127.0.0.1",
  "dialect": "mysql"
}</code></pre>

3. Use Sequlize to create tables
<pre><code>$ npx sequelize db:migrate</code></pre>

4. Set up seed files
<pre><code>$ npx sequelize db:seed:all</code></pre>

## Run the app
<pre><code>$ npm run dev or $ node app.js</code></pre>
The app will be running on `localhost:3000`

## Contributor
[Jacky Chen](https://github.com/snmo2546)
