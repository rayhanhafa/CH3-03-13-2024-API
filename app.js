const fs = require("fs");
const express = require('express');
const { error } = require("console");

const app = express()
const PORT = 8000;

//middleware untuk membaca json dari request body ke kita
app.use(express.json())

const customers = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dummy.json`)
);

//localhost : 8000
const defaultRouter = ('/', (req, res, next) => {
    res.send("<h1>HALLO FSW 1</h1>");

});

//api untuk get all data
const getCustomer = ('/api/v1/customers', (req, res, next) => {
    res.status(200).json({
        status: "succes",
        totalData: customers.length,
        data: {
            customers,
        },
    });
});

//api untuk get data by id
const getCustomerById = ('/api/v1/customers/:id', (req, res, next) => {
    // console.log(req.params)
    // console.log(req.params.id)
    const id = req.params.id

    //menggunakan array method untuk membantu menentukan data
    const customer = customers.find((cust) => cust._id === id)

    console.log(customer)

    res.status(200).json({
        status: "success",
        //totalData: customers, 
        data: {
            customer,
        },
    })
});

//api untuk update data
const updateCustomerById = (`/api/v1/customers/:id`, (req, res) => {
    const id = req.params.id

    const customer = customers.find((cust) => cust._id === id)
    const customerIndex = customers.findIndex((cust) => cust._id === id);

    if (!customer) {
        return req.status(404).json({    //bad
            status: "fail",
            message: `customer dengan Id : ${id} gak ada`,
        })
    }

    customers[customerIndex] = { ...customers[customerIndex], ...req.body }

    fs.writeFile(`${__dirname}/data/dummy.json`, JSON.stringify(customers), err => {
        res.status(200).json({
            status: 'succes',
            message: 'berhasil update data',
            data: {
                customer: customer[customerIndex],
                customer,
            },
        });
    })
})

//api untuk delete data
const deleteCustomerById = (`/api/v1/customers/:id`, (req, res) => {
    const id = req.params.id

    const customer = customers.find((cust) => cust._id === id)
    const customerIndex = customers.findIndex((cust) => cust._id === id);

    if (!customer) {
        return req.status(404).json({    //bad
            status: "fail",
            message: `customer dengan Id : ${id} gak ada`,
        })
    }

    // customers[customerIndex] = { ...customers[customerIndex], ...req.body }
    customers.splice(customerIndex, 1)

    fs.writeFile(`${__dirname}/data/dummy.json`, JSON.stringify(customers), err => {
        res.status(200).json({
            status: 'succes',
            message: 'berhasil delete data'
        });
    })
})

//api untuk add data
const addCustomer = ("/api/v1/customers", (req, res) => {
    console.log(req.body);
    const newCustomer = req.body;
    customers.push(newCustomer);
    fs.writeFile(`${__dirname}/data/dummy.json`, JSON.stringify(customers), err => {
        res.status(201).json({
            status: "succes",
            data: {
                customers: newCustomer, // Mengirim kembali data pelanggan yang baru saja ditambahkan
            },
        })
    })

    res.send("oke udah")
});
app.get("/", defaultRouter);
app.get("/api/v1/customers", getCustomer);
app.get("/api/v1/customers/:id", getCustomerById);
app.patch("/api/v1/customers/:id", updateCustomerById);
app.delete("/api/v1/customers/:id", deleteCustomerById);
app.post("/api/v1/customers", addCustomer);











app.listen(PORT, () => {
    console.log('APP running on port : ' + PORT);
});


