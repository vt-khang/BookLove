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
                    global.registered = true;
                    global.user = MongooseToObject(account);
                    global.name_user = String(global.user.name)
                        .split(' ')
                        .pop();
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
