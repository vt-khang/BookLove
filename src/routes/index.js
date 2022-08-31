// Global variables
const HomeRouter = require('./home');
const LoginRouter = require('./login');
const SignupRouter = require('./signup');
const BookRouter = require('./book');
const UserRouter = require('./user');

// Initial route function
function route(app) {
    app.use('/log-in', LoginRouter);
    app.use('/sign-up', SignupRouter);
    app.use('/book', BookRouter);
    app.use('/user', UserRouter);
    app.use('/', HomeRouter);
}

// Export
module.exports = route;
