// Import
const url = require('url');
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const serverless = require('serverless-http');
const morgan = require('morgan');
const MethodOverride = require('method-override');

// Global variables
const app = express();
const port = process.env.PORT || 3000;
const route = require('./routes');
const database = require('./database');

// Connect to database (MongoDB)
database.connect();

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(MethodOverride('_method'));

// HTTP logger
app.use(morgan('combined'));

// Template engine 'express-handlebars'
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            multiple: (a, b) => a * b,
            concat: (a, b) => [a,b].join(''),
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Initial route
route(app);

// Listen port
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// Export
module.exports = app;
module.exports.handler = serverless(app);
