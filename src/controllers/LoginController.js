// Global variables
const Account = require('../models/Account');
const { MongooseToObject } = require('../util/mongoose');
const bcrypt = require('bcryptjs');

class LoginController {
    // [GET] /
    index(req, res, next) {
        res.render('login', {
            alert: '',
        });
    }

    // [POST] /
    login(req, res, next) {
        Account.findOne({
            username: req.body.username,
        })
            .then((account) => {
                if (bcrypt.compareSync(req.body.password, account.password)) {
                    res.cookie('registered', 'true');
                    res.cookie('id', String(account._id));
                    res.cookie('username', account.username);
                    res.cookie('name', String(account.name).split(' ').pop());
                    res.cookie('total', account.total);
                    res.redirect('/');
                } else {
                    res.render('login', {
                        alert: 'Invalid username or password',
                    });
                }
            })
            .catch(next);
    }
}

// Export
module.exports = new LoginController();
