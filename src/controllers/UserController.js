// Global variables
const Account = require('../models/Account');
const Bill = require('../models/Bill');
const Book = require('../models/Book');
const { MongooseToObject } = require('../util/mongoose');
const { MultipleMongooseToObject } = require('../util/mongoose');
const bcrypt = require('bcryptjs');

class UserController {
    // [GET] /bill
    index(req, res, next) {
        Account.findById(req.cookies.id)
            .then((account) => {
                res.render('user/bill', {
                    cart: MultipleMongooseToObject(account.cart),
                    total: account.total,
                    user: account,
                    name_user: req.cookies.name,
                    alert: account.cart.length == 0,
                });
            })
            .catch(next);
    }

    // [DELETE] /bill
    destroy(req, res, next) {
        Account.findOneAndUpdate(
            { _id: req.cookies.id },
            { $set: { cart: [] }, total: 0 },
            { safe: true, multi: false },
        )
            .then(
                setTimeout(function () {
                    res.cookie('total', 0);
                    res.redirect('back');
                }, 500),
            )
            .catch(next);
    }

    // [PUT] /bill/:slug/:n
    update(req, res, next) {
        var price = 0;
        var m = 0;
        Account.findById(req.cookies.id)
            .then((account) => {
                account.cart.forEach((item) => {
                    if (item.slug == req.params.slug) {
                        price = item.price;
                        m = item.quantity;
                    }
                });
                Account.findOneAndUpdate(
                    { _id: req.cookies.id, 'cart.slug': req.params.slug },
                    {
                        $set: {
                            'cart.$.quantity': req.params.n,
                            'cart.$.total': price * req.params.n,
                        },
                        total:
                            req.params.n < m
                                ? Math.round(
                                      (Number(req.cookies.total) -
                                          (m - req.params.n) * price) *
                                          100,
                                  ) / 100
                                : req.params.n > m
                                ? Math.round(
                                      (Number(req.cookies.total) +
                                          (req.params.n - m) * price) *
                                          100,
                                  ) / 100
                                : Number(req.cookies.total),
                    },
                    { safe: true, multi: false },
                )
                    .then(
                        setTimeout(function () {
                            res.cookie(
                                'total',
                                req.params.n < m
                                    ? Math.round(
                                          (Number(req.cookies.total) -
                                              (m - req.params.n) * price) *
                                              100,
                                      ) / 100
                                    : req.params.n > m
                                    ? Math.round(
                                          (Number(req.cookies.total) +
                                              (req.params.n - m) * price) *
                                              100,
                                      ) / 100
                                    : Number(req.cookies.total),
                            );
                            res.redirect('back');
                        }, 500),
                    )
                    .catch(next);
            })
            .catch(next);
    }

    // [DELETE] /bill/:slug
    delete(req, res, next) {
        var price = 0;
        Account.findById(req.cookies.id)
            .then((account) => {
                account.cart.forEach((item) => {
                    if (item.slug == req.params.slug) {
                        price = item.total;
                    }
                });
                Account.findOneAndUpdate(
                    { _id: req.cookies.id },
                    {
                        $pull: { cart: { slug: req.params.slug } },
                        total:
                            Math.round(
                                (Number(req.cookies.total) - price) * 100,
                            ) / 100,
                    },
                    { safe: true, multi: false },
                )
                    .then(
                        setTimeout(function () {
                            res.cookie(
                                'total',
                                Math.round(
                                    (Number(req.cookies.total) - price) * 100,
                                ) / 100,
                            );
                            res.redirect('back');
                        }, 500),
                    )
                    .catch(next);
            })
            .catch(next);
    }

    // [POST] /bill/pay
    pay(req, res, next) {
        Account.findOneAndUpdate(
            { _id: req.cookies.id },
            { $set: { cart: [] }, total: 0 },
            { safe: true, multi: false },
        )
            .then(
                setTimeout(function () {
                    res.cookie('total', 0);
                    res.redirect('back');
                }, 500),
            )
            .catch(next);
    }

    // [GET] /profile
    show(req, res, next) {
        Account.findById(req.cookies.id)
            .then((account) => {
                res.render('user/profile', {
                    me: MongooseToObject(account),
                    man: account.sex == 0,
                    name_user: req.cookies.name,
                });
            })
            .catch(next);
    }

    // [PUT] /profile/change
    profile(req, res, next) {
        Account.findOneAndUpdate(
            { _id: req.cookies.id },
            {
                name: req.body.name,
                sex: req.body.sex || 0,
                phone: req.body.phone || '',
                address: req.body.address || '',
            },
            { safe: true, multi: false },
        )
            .then(
                setTimeout(function () {
                    Account.findById(req.cookies.id)
                        .then((account) => {
                            res.cookie(
                                'name',
                                String(account.name).split(' ').pop(),
                            );
                            res.redirect('back');
                        })
                        .catch(next);
                }, 500),
            )
            .catch(next);
    }

    // [GET] /password
    password(req, res, next) {
        Account.findById(req.cookies.id)
            .then((account) => {
                res.render('user/password', {
                    name_user: req.cookies.name,
                });
            })
            .catch(next);
    }

    // [PUT] /password/change
    change(req, res, next) {
        if (req.body.newPassword != req.body.confirmPassword) {
            res.render('user/password', {
                alert: "Password doesn't match",
                notify: '',
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.newPassword, salt);

            Account.findById(req.cookies.id)
                .then((account) => {
                    if (
                        bcrypt.compareSync(
                            req.body.oldPassword,
                            account.password,
                        )
                    ) {
                        Account.findOneAndUpdate(
                            { _id: req.cookies.id },
                            {
                                password: password,
                            },
                            { safe: true, multi: false },
                        )
                            .then(() => {
                                res.render('user/password', {
                                    alert: '',
                                    notify: 'Change password successfully',
                                    name_user: req.cookies.name,
                                });
                            })
                            .catch(next);
                    } else {
                        res.render('user/password', {
                            alert: 'Wrong password',
                            notify: '',
                        });
                    }
                })
                .catch(next);
        }
    }
}

// Export
module.exports = new UserController();
