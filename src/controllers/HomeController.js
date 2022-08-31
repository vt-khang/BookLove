// Global variables
const Book = require('../models/Book');
const { MultipleMongooseToObject } = require('../util/mongoose');
const { MongooseToObject } = require('../util/mongoose');
const { LinkToString } = require('../util/stringencode');
const { StringToLink } = require('../util/stringencode');
const { LinkToLang } = require('../util/stringencode');
const { LangToLink } = require('../util/stringencode');

class HomeController {
    // [GET] /
    index(req, res, next) {
        const top = ['top1', 'top2', 'top3', 'top4', 'top5'];

        Book.find({})
            .sort({ buy: 'desc', name: 'asc' })
            .skip(5)
            .limit(18)
            .then((books) => {
                Book.find({})
                    .sort({ buy: 'desc', name: 'asc' })
                    .limit(5)
                    .then((tops) => {
                        res.render('home', {
                            books: MultipleMongooseToObject(books),
                            tops: MultipleMongooseToObject(tops).map(
                                (t, index) => [t, top[index]],
                            ),
                            registered: global.registered,
                            user: global.user,
                            name_user: String(global.user.name)
                                .split(' ')
                                .pop(),
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [GET] /search
    search(req, res, next) {
        // Initial filter variables
        const perPage = 20;
        const page = req.query.page || 1;
        const min = req.query.min || 0;
        const max = req.query.max || 999999;
        const genres =
            req.query.genre === undefined
                ? [
                      'Romance',
                      'Action & Adventure',
                      'Mystery & Thriller',
                      'Biographies & History',
                      "Children's",
                      'Young Adult',
                      'Fantasy',
                      'Historical Fiction',
                      'Horror',
                      'Literary Fiction',
                      'Non-Fiction',
                      'Science Fiction',
                  ]
                : String(req.query.genre)
                      .split(',')
                      .map((g) => LinkToString(g));
        const lang =
            req.query.lang === undefined
                ? ['English', 'Vietnamese']
                : String(req.query.lang)
                      .split(',')
                      .map((l) => LinkToLang(l));
        const sort = req.query.sort || 'new';
        const sortQuery =
            sort == 'new'
                ? { click: 'desc', name: 'asc' }
                : sort == 'low'
                ? { price: 'asc', name: 'asc' }
                : sort == 'high'
                ? { price: 'desc', name: 'asc' }
                : { click: 'desc', name: 'asc' };
        const sortBtn = { sortNew: '', sortLow: '', sortHigh: '' };
        if (sort == 'new') sortBtn.sortNew = 'active';
        else if (sort == 'low') sortBtn.sortLow = 'active';
        else if (sort == 'high') sortBtn.sortHigh = 'active';
        else sortBtn.sortNew = 'active';

        // URL search
        var url = '/search?';
        url = req.query.q === undefined ? url : url + '&q=' + req.query.q;
        url = req.query.min === undefined ? url : url + '&min=' + req.query.min;
        url = req.query.max === undefined ? url : url + '&max=' + req.query.max;
        url =
            req.query.genre === undefined
                ? url
                : url + '&genre=' + StringToLink(String(req.query.genre));
        url =
            req.query.lang === undefined
                ? url
                : url + '&lang=' + LangToLink(String(req.query.lang));
        url =
            req.query.sort === undefined
                ? url
                : url + '&sort=' + req.query.sort;
        url = url + '&page=';
        const newUrl = String(url).replace('?&', '?');
        const sortUrl = newUrl.replace('&page=', '').replace(/&?sort=\w*/, '');

        Book.find({
            name: new RegExp(req.query.q, 'i'),
            price: { $gt: min, $lt: max },
            genres: { $in: genres },
            language: { $in: lang },
        })
            .sort(sortQuery)
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then((books) => {
                Book.count({
                    name: new RegExp(req.query.q, 'i'),
                    price: { $gt: min, $lt: max },
                    genres: { $in: genres },
                    language: { $in: lang },
                })
                    .then((count) => {
                        res.render('search', {
                            books: MultipleMongooseToObject(books),
                            current: Number(page),
                            pages: Math.ceil(count / perPage),
                            conditionPages: {
                                validPages: Math.ceil(count / perPage) > 0,
                                validFirstPage:
                                    Math.ceil(count / perPage) - Number(page) >=
                                        0 || Math.ceil(count / perPage) >= 1,
                                validSecondPage:
                                    Math.ceil(count / perPage) - Number(page) >=
                                        1 || Math.ceil(count / perPage) >= 2,
                                validThirdPage:
                                    Math.ceil(count / perPage) - Number(page) >=
                                        2 || Math.ceil(count / perPage) >= 3,
                                currentFirstPage: Number(page) == 1,
                                currentSecondPage:
                                    Math.ceil(count / perPage) < 3
                                        ? Number(page) == 2
                                        : Number(page) > 1 &&
                                          Number(page) <
                                              Math.ceil(count / perPage),
                                currentThirdPage:
                                    Number(page) == Math.ceil(count / perPage),
                                alert: count == 0,
                            },
                            numberPages: {
                                firstPage:
                                    Number(page) == 1
                                        ? Number(page)
                                        : Math.ceil(count / perPage) -
                                              Number(page) ==
                                          0
                                        ? Math.ceil(count / perPage) < 3
                                            ? Number(page) - 1
                                            : Number(page) - 2
                                        : Number(page) - 1,
                                firstUrl:
                                    newUrl +
                                    String(
                                        Number(page) == 1
                                            ? Number(page)
                                            : Math.ceil(count / perPage) -
                                                  Number(page) ==
                                              0
                                            ? Math.ceil(count / perPage) < 3
                                                ? Number(page) - 1
                                                : Number(page) - 2
                                            : Number(page) - 1,
                                    ),
                                secondPage:
                                    Number(page) == 1
                                        ? Number(page) + 1
                                        : Math.ceil(count / perPage) -
                                              Number(page) ==
                                          0
                                        ? Math.ceil(count / perPage) < 3
                                            ? Number(page)
                                            : Number(page) - 1
                                        : Number(page),
                                secondUrl:
                                    newUrl +
                                    String(
                                        Number(page) == 1
                                            ? Number(page) + 1
                                            : Math.ceil(count / perPage) -
                                                  Number(page) ==
                                              0
                                            ? Math.ceil(count / perPage) < 3
                                                ? Number(page)
                                                : Number(page) - 1
                                            : Number(page),
                                    ),
                                thirdPage:
                                    Number(page) == 1
                                        ? Number(page) + 2
                                        : Math.ceil(count / perPage) -
                                              Number(page) ==
                                          0
                                        ? Number(page)
                                        : Number(page) + 1,
                                thirdUrl:
                                    newUrl +
                                    String(
                                        Number(page) == 1
                                            ? Number(page) + 2
                                            : Math.ceil(count / perPage) -
                                                  Number(page) ==
                                              0
                                            ? Number(page)
                                            : Number(page) + 1,
                                    ),
                                prevUrl:
                                    newUrl +
                                    String(
                                        Number(page) == 1
                                            ? Math.ceil(count / perPage)
                                            : Number(page) - 1,
                                    ),
                                nextUrl:
                                    newUrl +
                                    String(
                                        Number(page) ==
                                            Math.ceil(count / perPage)
                                            ? 1
                                            : Number(page) + 1,
                                    ),
                            },
                            q: req.query.q,
                            count: count,
                            url: newUrl,
                            sort: {
                                btn: sortBtn,
                                url: sortUrl,
                            },
                            registered: global.registered,
                            user: global.user,
                            name_user: String(global.user.name)
                                .split(' ')
                                .pop(),
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [POST] /search
    filter(req, res, next) {
        var url = '/search?';
        // Genres
        var genre = [];
        if (req.body.action_and_adventure != undefined)
            genre.push('action-and-adventure');
        if (req.body.biographies_and_history != undefined)
            genre.push('biographies-and-history');
        if (req.body.childrens != undefined) genre.push('childrens');
        if (req.body.fantasy != undefined) genre.push('fantasy');
        if (req.body.historical_fiction != undefined)
            genre.push('historical-fiction');
        if (req.body.horror != undefined) genre.push('horror');
        if (req.body.literary_fiction != undefined)
            genre.push('literary-fiction');
        if (req.body.mystery_and_thriller != undefined)
            genre.push('mystery_and_thriller');
        if (req.body.non_fiction != undefined) genre.push('non-fiction');
        if (req.body.romance != undefined) genre.push('romance');
        if (req.body.science_fiction != undefined)
            genre.push('science-fiction');
        if (req.body.young_adult != undefined) genre.push('young-adult');
        url = genre.length == 0 ? url : url + '&genre=' + genre.join(',');
        // Price
        url =
            req.body.min_price == '' ? url : url + '&min=' + req.body.min_price;
        url =
            req.body.max_price == '' ? url : url + '&max=' + req.body.max_price;
        // Language
        var lang = [];
        if (req.body.en != undefined) lang.push('en');
        if (req.body.vn != undefined) lang.push('vn');
        url = lang.length == 0 ? url : url + '&lang=' + lang.join(',');

        const newUrl = url.replace('?&', '?');
        res.redirect(newUrl);
    }

    // [POST] /feedback
    feedback(req, res, next) {
        res.redirect('/');
    }

    // [GET] /log-out
    logout(req, res, next) {
        global.registered = false;
        res.redirect('/');
    }
}

// Export
module.exports = new HomeController();
