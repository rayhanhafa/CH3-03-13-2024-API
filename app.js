const express = require("express");
const morgan = require("morgan");

const app = express();


const customerRouter = require('./routes/customerRoutes');

// middleware untuk membaca json dari request body ke kita
app.use(express.json());

//middleware dari thrid party = 3rd party middleware
app.use(morgan('dev'));

//middleware kita sendiri
app.use((req, res, next) => {
    console.log("Heloo FSW 1, Ini Middleware kita sendiri..");
    next();
});

//middleware kita tentang request time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//api default
const defaultRouter = (req, res, next) => {
    res.send("<p>Hello FSW 1 tercinta</p>");
};

app.use("/api/v1/customers", customerRouter);

app.get("/", defaultRouter);

module.exports = app;

