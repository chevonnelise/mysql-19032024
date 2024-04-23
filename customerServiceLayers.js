const data = require('./customerDataLayer');
const { getCustomerCountForEmployee } = require('./employeeDataLayer');

async function getAllCustomers() {
    const customers = await data.getAllCustomers();
    return customers;
}

async function addCustomer(first_name, last_name, rating, company_id, employees) {
    console.log(employees)
    // make sure each of the employee is not serving 10 customers already because 10 is the max
    for (let employeeId of employees) {
        const customerCount = await getCustomerCountForEmployee(employeeId);
        if (customerCount == 10) {
            return {
                'success': false,
                'message':'One or more employee has reached maximum quota for customers'
            }
        }
    }


    const results = await data.addCustomer(first_name, last_name, rating, company_id);
    return {
        'success': true,
        'insertId': results
    }

}

async function findOneCustomer(customerId){
    const customer = await data.findOneCustomer(customerId);
    console.log("customer service layer here", customer);
    return customer;
}

async function updateCustomer(customerId, newData){
    const result = await data.updateCustomer(customerId, newData);
    return result;
}

async function deleteCustomer(customerId){
    const customer = await data.deleteCustomer(customerId);
    return customer;
}

module.exports = { getAllCustomers, addCustomer, findOneCustomer, deleteCustomer, updateCustomer};