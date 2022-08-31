// Global variables
const Account = require('../models/Account');
const Book = require('../models/Book');
const { MongooseToObject } = require('../util/mongoose');
const { StringToLink } = require('../util/stringencode');

class BookController {
    // [GET] /:slug
    show(req, res, next) {
        Book.findOne({ slug: req.params.slug })
            .then((books) => {
                Book.findOneAndUpdate(
                    { slug: req.params.slug },
                    {
                        $set: {
                            click: books.click + 1,
                        },
                    },
                    { safe: true, multi: false },
                )
                    .then(() =>
                        res.render('book', {
                            book: MongooseToObject(books),
                            genres: books.genres.map((i) => [
                                i,
                                StringToLink(i),
                            ]),
                            registered: global.registered,
                            user: global.user,
                            name_user: global.name_user,
                        }),
                    )
                    .catch(next);
            })
            .catch(next);
    }

    // [PUT] /:slug/buy
    buy(req, res, next) {
        Book.findById(req.body.book)
            .then((book) => {
                Book.findOneAndUpdate(
                    { slug: book.slug },
                    {
                        $set: {
                            buy: book.buy + 1,
                        },
                    },
                    { safe: true, multi: false },
                )
                    .then(() => {
                        var duplicated = false;
                        var amount = 0;
                        global.user.cart.forEach((item) => {
                            if (item.slug == book.slug) {
                                duplicated = true;
                                amount = item.quantity;
                            }
                        });
                        if (duplicated) {
                            Account.findOneAndUpdate(
                                { _id: global.user._id, 'cart.slug': book.slug },
                                {
                                    $set: {
                                        'cart.$.quantity':
                                            Number(amount) +
                                            Number(req.body.quantity),
                                        'cart.$.total':
                                            Math.round(
                                                book.price *
                                                    (Number(amount) +
                                                        Number(req.body.quantity)) *
                                                    100,
                                            ) / 100,
                                    },
                                    total:
                                        global.user.total +
                                        book.price * req.body.quantity,
                                },
                                { safe: true, multi: false },
                            )
                                .then(
                                    setTimeout(function () {
                                        Account.findById(global.user._id)
                                            .then((account) => {
                                                global.registered = true;
                                                global.user =
                                                    MongooseToObject(account);
                                                global.name_user = String(
                                                    global.user.name,
                                                )
                                                    .split(' ')
                                                    .pop();
                                                res.redirect('/user/bill');
                                            })
                                            .catch(next);
                                    }, 500),
                                )
                                .catch(next);
                        } else {
                            Account.findOneAndUpdate(
                                { _id: global.user._id },
                                {
                                    $push: {
                                        cart: {
                                            name: book.name,
                                            price: book.price,
                                            image: book.image,
                                            slug: book.slug,
                                            quantity: req.body.quantity,
                                            total: book.price * req.body.quantity,
                                        },
                                    },
                                    total:
                                        global.user.total +
                                        book.price * req.body.quantity,
                                },
                                { safe: true, multi: false },
                            )
                                .then(
                                    setTimeout(function () {
                                        Account.findById(global.user._id)
                                            .then((account) => {
                                                global.registered = true;
                                                global.user =
                                                    MongooseToObject(account);
                                                global.name_user = String(
                                                    global.user.name,
                                                )
                                                    .split(' ')
                                                    .pop();
                                                res.redirect('/user/bill');
                                            })
                                            .catch(next);
                                    }, 500),
                                )
                                .catch(next);
                        }
                    })
                    .catch(next);
            })
            .catch(next);
    }
}

// Export
module.exports = new BookController();
