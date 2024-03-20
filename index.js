const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');
const { connect } = require('http2');
const { redirect } = require('express/lib/response');

let app = express();

// set up the view engine
app.set('view engine', 'hbs');
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({extended: false}));

// wax-on (template inheritance)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    // console.log(process.env);
    const connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/customers', async function (req, res){
        let [customers] = await connection.execute(`
        SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN 
        Companies ON Customers.company_id = Companies.company_id
        ORDER BY first_name
        `);
        res.render('customers',{
            'customers': customers
        })
    })

    app.get('/create-customers', async function(req,res){
        const [companies] = await connection.execute(`SELECT * FROM Companies`);
        const [employees] = await connection.execute(`SELECT * FROM Employees`);
        res.render('create-customers', {
            companies,
            employees
        }); 
    })

    app.post('/create-customers', async function(req,res){
        const {first_name,last_name,rating,company_id} = req.body;
        const query = `INSERT INTO Customers (first_name, last_name, rating, company_id)
        VALUES ("${first_name}", "${last_name}", ${rating}, ${company_id});`

        const [response] = await connection.execute(query);

        const insertId = response.insertId;

        const {selectedEmployees} = req.body;

        let employeeArray = [];
        if (Array.isArray(selectedEmployees)){
            employeeArray = selectedEmployees;
        } else {
            employeeArray.push(selectedEmployees);
        }

        for (let employee_id of employeeArray) {
            await connection.execute(`INSERT INTO EmployeeCustomer(employee_id,customer_id)
                                VALUES (?, ?)
            `, [employee_id, insertId])
        }
        res.redirect('/customers');
    })

    app.get("/delete-customers/:customerId", async function (req,res){
        const {customerId} = req.params;
        const query = `SELECT * FROM Customers WHERE customer_id = ?`

        const [customers] = await connection.execute(query, [customerId]);
        const customerToDelete = customers[0]; 

        res.render('delete-customer', {
            'customer': customerToDelete
        })
    })

    app.post('/delete-customers/:customerId', async function (req, res){
        const {customerId} = req.params;

        // check if the customerId is in a relationship with an employee
        const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ${customer_id}`
        const [involved] = await connection.execute(checkCustomerQuery);
        if (involved.length > 0) {
            res.send("Unable to delete because the customer is in a sales relationship with an employee")
            return;
        }
        const query = `DELETE FROM Customers WHERE customer_id = ${customerId}`
        await connection.execute(query);
        res.redirect('/customers'); 
    })

    app.get('/update-customers/:customerId', async function (req,res){
        const {customerId} = req.params;
        const {}
    })

}

main();

app.listen(3000, function(){
    console.log("Server has started");
})