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
                            registered: req.cookies.registered == 'true',
                            name_user: req.cookies.name,
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
                        Account.findById(req.cookies.id)
                            .then((account) => {
                                account.cart.forEach((item) => {
                                    if (item.slug == book.slug) {
                                        duplicated = true;
                                        amount = item.quantity;
                                    }
                                });
                                if (duplicated) {
                                    Account.findOneAndUpdate(
                                        {
                                            _id: req.cookies.id,
                                            'cart.slug': book.slug,
                                        },
                                        {
                                            $set: {
                                                'cart.$.quantity':
                                                    Number(amount) +
                                                    Number(req.body.quantity),
                                                'cart.$.total':
                                                    Math.round(
                                                        book.price *
                                                            (Number(amount) +
                                                                Number(
                                                                    req.body
                                                                        .quantity,
                                                                )) *
                                                            100,
                                                    ) / 100,
                                            },
                                            total:
                                                Number(req.cookies.total) +
                                                book.price * req.body.quantity,
                                        },
                                        { safe: true, multi: false },
                                    )
                                        .then(
                                            setTimeout(function () {
                                                res.cookie(
                                                    'total',
                                                    Number(req.cookies.total) +
                                                        book.price *
                                                            req.body.quantity,
                                                );
                                                res.redirect('/user/bill');
                                            }, 500),
                                        )
                                        .catch(next);
                                } else {
                                    Account.findOneAndUpdate(
                                        { _id: req.cookies.id },
                                        {
                                            $push: {
                                                cart: {
                                                    name: book.name,
                                                    price: book.price,
                                                    image: book.image,
                                                    slug: book.slug,
                                                    quantity: req.body.quantity,
                                                    total:
                                                        book.price *
                                                        req.body.quantity,
                                                },
                                            },
                                            total:
                                                Number(req.cookies.total) +
                                                book.price * req.body.quantity,
                                        },
                                        { safe: true, multi: false },
                                    )
                                        .then(
                                            setTimeout(function () {
                                                res.cookie(
                                                    'total',
                                                    Number(req.cookies.total) +
                                                        book.price *
                                                            req.body.quantity,
                                                );
                                                res.redirect('/user/bill');
                                            }, 500),
                                        )
                                        .catch(next);
                                }
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }
}

// Export
module.exports = new BookController();
