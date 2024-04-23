const express = require('express');
const cors = require('cors');
const { connectToDB, getConnection } = require('./sql');
const customerServices = require('./customerServiceLayers');
require('dotenv').config();

const app = express();

// RESTFUL API
app.use(cors()); // enable cross-origin resource sharing
app.use(express.json()); // enable sending back responses as JSON and receiving data as JSON

async function main() {
    await connectToDB(
        process.env.DB_HOST,
        process.env.DB_USER,
        process.env.DB_DATABASE,
        process.env.DB_PASSWORD
    );

    const connection = getConnection();

    app.get('/api/customers', async function(req, res) {
        const customers = await customerServices.getAllCustomers();
        res.json({
            'customers': customers
        });
    });

    app.post('/api/customers', async function(req, res) {
        const { first_name, last_name, rating, company_id, employees} = req.body;
        console.log(req.body);
        const results = await customerServices.addCustomer(first_name, last_name, rating, company_id, employees);
        
        if (results.success) {
            res.status(201).json({
                'new_customer_id': results.insertId
            });
        } else {
            res.status(400).json(results);
        }
    });

    app.get('/api/customer-to-delete/:customerId', async function(req, res) {
        const { customerId } = req.params;
        const customers = await customerServices.findOneCustomer(customerId);
        res.json({
            'customers': customers
        });
    });

    app.delete('/api/customers/:customerId', async function(req, res) {
        console.log("route hiting")
        const { customerId } = req.params;
        console.log(customerId);
        const results = await customerServices.deleteCustomer(customerId);
        if (results.success) {
            res.status(200).json(results);
        } else {
            res.status(400).json(results);
        }
    });

    app.get('/api/customer-to-update/:customerId', async function(req, res) {
        const { customerId } = req.params;
        const customers = await customerServices.findOneCustomer(customerId);
        console.log("index.js", customers);
        res.json({
            'customers': customers
        });
    });

    app.put('/api/customers/:customerId', async function(req, res) {
        console.log("update route hit");
        const { customerId } = req.params;
        await customerServices.updateCustomer(customerId, req.body);
        res.json({
            'message': "The user has been updated successfully"
        });
    });
}

main();

const PORT = process.env.PORT || 3005;

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
