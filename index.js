const express = require('express');
const { createConnection } = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

let app = express();

// RESTFUL API
app.use(cors()); // enable cross origin resources sharing
app.use(express.json()); // enable sending back responses as JSON
                        // and receiving data as JSON

async function main() {
    const connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    // // routes
    // const landingRoutes = require('./routes/landing');
    // const productRoutes = require('./routes/products');

    // // use the landing routes
    // app.use('/', landingRoutes);
    // app.use('/products', productRoutes);

    app.get('/api/customers', async function (req, res) {

        const {search} = req.query;
        console.log(search);
        let [customers] = !search?await connection.execute(`
        SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN 
        Companies ON Customers.company_id = Companies.company_id
        ORDER BY customer_id
        `): await connection.execute(`
        SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN 
        Companies ON Customers.company_id = Companies.company_id WHERE first_name LIKE ? OR last_name LIKE ?
        ORDER BY customer_id
        `, [`%${search}%`, `%${search}%`]);
        res.json({
            customers
        })
    })
    
    // app.post('/customers', async function (req, res) {
    //     const { name } = req.body;
    //     res.redirect(`/customers?search=${encodeURIComponent(name)}`)
    // })

    app.post('/api/customers', async function (req, res) {
        const { first_name, last_name, rating, company_id } = req.body;
        const query = `INSERT INTO Customers (first_name, last_name, rating, company_id)
        VALUES ("${first_name}", "${last_name}", ${rating}, ${company_id});`

        const [response] = await connection.execute(query);

        const insertId = response.insertId;

        const { employees } = req.body;
        console.log(employees);
        let employeeArray = [];
        if (Array.isArray(employees)) {
            employeeArray = employees;
        } else {
            employeeArray.push(employees);
        }
        console.log(employeeArray);
        for (let employee_id of employeeArray) {
            console.log(employee_id,insertId)
            await connection.execute(`INSERT INTO EmployeeCustomer(employee_id,customer_id)
                                VALUES (?, ?)
            `, [employee_id, insertId])
        }
        res.json({
            'new_customer_id': insertId
        });
    })

    app.delete('/api/customers/:customerId', async function (req, res) {
        const { customerId } = req.params;

        // check if the customerId is in a relationship with an employee
        const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ${customerId}`
        const [involved] = await connection.execute(checkCustomerQuery);
        if (involved.length > 0) {
            res.send("Unable to delete because the customer is in a sales relationship with an employee")
            return;
        }
        const query = `DELETE FROM Customers WHERE customer_id = ${customerId}`
        await connection.execute(query);
        res.json({
            'status':"Customer has been deleted"
        });
    })

    app.put('/api/customers/:customerId', async function (req, res) {
        const { customerId } = req.params;
        const { first_name, last_name, rating, company_id } = req.body
        const query = `UPDATE Customers SET first_name="${first_name}", 
                        last_name="${last_name}", 
                        rating="${rating}", 
                        company_id="${company_id}"
                        WHERE customer_id = ${customerId}; `
        await connection.execute(query);
        res.json({
            'message': "The user has been updated successfully."
        });
    })
}

main();

app.listen(3000, function () {
    console.log("Server has started");
})