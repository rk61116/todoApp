const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const todoRoutes = require('./api/routes/todos');
const dbConf = require('./api/config/db');

mongoose.set('useCreateIndex', true);
if(process.env.NODE_ENV !== 'test'){
    mongoose.connect(dbConf.url, { useUnifiedTopology: true, useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//This to handle cros(cross origin resource sharing) errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access.Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
        res.status(200).json({});
    };
    next();
});

//Routes which should handle requests
app.use('/user', userRoutes);
app.use('/todo', todoRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error:{
            message:error.message
        }
    });
});


module.exports = app;