const { getConnection } = require("./sql");

async function getAllCustomers() {
    const connection = getConnection();

    // the [ ] is known as array destructuring
    let [customers] = await connection.execute(`
     SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN
      Companies ON Customers.company_id = Companies.company_id
      ORDER BY first_name
    `);
    // is the same as:
    // let customers = await connection.execute("SELECT * FROM Customers")[0];
    return customers;

}

// async function addCustomer(firstName, lastName, rating, company_id, employees) {

//     const connection = getConnection();

//     // create the query
//     const query = `INSERT INTO Customers (first_name, last_name, rating, company_id)
//     VALUES (?,?,?,?);`

//     // get the query to test
//     // res.send(query);

//     const [response] = await connection.execute(query, [firstName, lastName, rating, company_id]);
//     const insertId = response.insertId; // id of the newly created customer

//     // ADD IN M:N relationship after the creating the row
//     // We have to do so because the primary key is only available after the inser

//     let employeeArray = [];
//     if (Array.isArray(employees)) {
//         employeeArray = employees;
//     } else {
//         employeeArray.push(employees);
//     }

//     for (let employee_id of employeeArray) {
//         await connection.execute(`INSERT INTO EmployeeCustomer (employee_id, customer_id) 
//         VALUES (?, ?)
//             `, [parseInt(employee_id), insertId])
//     }

//     return insertId;
// }

async function addCustomer(firstName, lastName, rating, company_id, employees) {
    const connection = getConnection();

    // create the query to insert customer data
    const customerQuery = `INSERT INTO Customers (first_name, last_name, rating, company_id)
                           VALUES (?, ?, ?, ?);`;

    const [customerResponse] = await connection.execute(customerQuery, [firstName, lastName, rating, company_id]);
    console.log(customerResponse);
    const insertId = customerResponse.insertId; // id of the newly created customer

    // Log the insertId to ensure it's retrieved correctly
    console.log('Inserted customer ID:', insertId);

    // Ensure that employees is an array
    // const employeeArray = Array.isArray(employees) ? employees : [employees];

    // // Loop through employee IDs and insert them into EmployeeCustomer table
    // for (const employee_id of employeeArray) {
    //     // Log the employee_id to ensure it's correct before insertion
    //     console.log('Inserting employee ID:', employee_id);
    //     await connection.execute(`INSERT INTO EmployeeCustomer (employee_id, customer_id) 
    //                               VALUES (?, ?)`, [parseInt(employee_id), insertId]);
    // }

    return insertId;
}


async function deleteCustomer(customerId) {
    const connection = getConnection();
    // check if the customerId in a relationship with an employee
    console.log("DAL hit in delete")
    const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ?`;
    const [involved] = await connection.execute(checkCustomerQuery, [customerId]);
    console.log("involved here in DAL", involved)
    // if (involved.length > 0) {
    //     return {
    //         'success': false,
    //         'message': "Unable to delete because the customer is in a sales relationship of an employee"
    //     }
    // }

    const pivotQuery = `DELETE FROM EmployeeCustomer WHERE customer_id = ?`;
    await connection.execute(pivotQuery, [customerId]);

    console.log("it is working until hre");

    const salesQuery = `DELETE FROM Sales WHERE customer_id = ?`;
    await connection.execute(salesQuery, [customerId]);

    console.log("it is working until hre 2");

    const query = `DELETE FROM Customers WHERE customer_id = ?`;
    await connection.execute(query, [customerId]);
    return {
        'success': true,
        'message': 'Customer has been deleted'
    }
}
async function findOneCustomer (customerId) {
    const connection = getConnection();
    const query = `SELECT * FROM Customers WHERE customer_id=?`
    let customer = await connection.execute(query, [customerId]);
    console.log(customer[0]);
    return customer[0]; 
    
}

async function updateCustomer(customerId, newCustomerRating) {
    const connection = getConnection();
    const query = `UPDATE Customers SET rating=? WHERE customer_id = ?;`
  
    console.log("DAL updatecustomer here", newCustomerRating)
    // update the customer first
    const {rating} = newCustomerRating;
    console.log(rating);
    await connection.execute(query, [rating, customerId]);

    return {
        'success': true,
        'message': 'Customer has been updated'
    }
    // 1. update the relationship by first DELETE all M:N relationships
    // await connection.execute("DELETE FROM EmployeeCustomer WHERE customer_id = ?", [customerId]);

    // 2. add back the relationship that is selected by the user
    // ADD IN M:N relationship after the creating the row
    // We have to do so because the primary key is only available after the insert
//     const { employees } = newCustomer; // same as `const employees = req.body.employees`

//     let employeeArray = [];
//     if (Array.isArray(employees)) {
//         employeeArray = employees;
//     } else {
//         employeeArray.push(employees);
//     }

//     for (let employee_id of employeeArray) {
//         await connection.execute(`INSERT INTO EmployeeCustomer (employee_id, customer_id) 
//             VALUES (?, ?)
// `, [employee_id, customerId])
//     }
}

module.exports = { getAllCustomers, addCustomer, deleteCustomer, findOneCustomer, updateCustomer };