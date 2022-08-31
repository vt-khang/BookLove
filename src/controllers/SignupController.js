// Global variables
const Account = require('../models/Account');
const { MongooseToObject } = require('../util/mongoose');
const bcrypt = require('bcryptjs');

class SignupController {
    // [GET] /
    index(req, res, next) {
        res.render('signup');
    }

    // [POST] /
    create(req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.render('signup', {
                alert: "Password doesn't match",
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);

            const account = new Account(req.body);
            account
                .save()
                .then(() => {
                    global.registered = true;
                    global.user = MongooseToObject(account);
                    global.name_user = String(global.user.name)
                        .split(' ')
                        .pop();
                    res.redirect('/');
                })
                .catch(() => {
                    res.render('signup', {
                        alert: 'This account is already existed',
                    });
                });
        }
    }
}

// Export
module.exports = new SignupController();
