# About this project
This project is a MySQL database for a financial advisory company.

**Entity-Relationship Diagram (ERD)**
![erd](entity-framework/financial-advisory-company-erd.png)

# Installation
To run the databases, insert schema.sql data: in the terminal, type in `mysql -u root < dataset/schema.sql`
To run the databases, insert data.sql data: in the terminal, type in `mysql -u root < dataset/data.sql`

# Usage
**Check data in dataset**
1. To start mysql, in the terminal, type in `mysql -u root`
2. To change database, in the terminal, type in `use crm`
3. To show database, in the terminal, type in `show databases;`
4. To show tables, in the terminal, type in `show table;`

**Do CRUD in terminal**
1. To initialize, in the terminal, type in `npm init -y`
2. To run packages, in the terminal, type in `npm install`
3. To ensure that the CRUD is working, add a `.env` file and copy+paste the following:
DB_HOST=localhost
DB_USER=root
DB_NAME=crm
DB_PASSWORD=
4. To start server, in the terminal, type in `npm install -g nodemon` then `nodemon`

**Create**
To create a new customer, add in `create-customers` to the end of the port URL. Add in customer's first name, last name, rating, company (that customer invested in), employee (that customer purchased investment from).
![post-method-create-customers](post-method-create-customers.png)

**Read**
To get list of existing customers, add in `/customers` to the end of the port URL. 
![get-customers](get-customers.png)

To find a specific customer in the existing list, go to the searchbox and type in the customer's first name or last name.

**Update**
To update the list of customers, you can do after adding in `/customers` to the end of the port URL, click on `update` button for the specific customer to update that customer's details.
![get-customers](get-customers.png)

**Delete**
To delete a customer, you can do after adding in `/customers` to the end of the port URL, click on `delete` button for the specific customer to update that customer's details.
![get-customers](get-customers.png)

