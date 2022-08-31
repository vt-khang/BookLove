// Import
const mongoose = require('mongoose');
const MongooseSlug = require('mongoose-slug-generator');

// Global variables
const Schema = mongoose.Schema;

// Initial slug
mongoose.plugin(MongooseSlug);

// Book Scheme
const Book = new Schema({
    name: { type: String },
    price: { type: Number },
    image: { type: String },
    slug: { type: String },
    quantity: { type: Number },
    total: { type: Number },
});
// Account Schema
const Account = new Schema(
    {
        username: { type: String, maxLength: 255, unique: true, require: true },
        address: { type: String, default: '' },
        name: { type: String, maxLength: 255, default: 'worm' },
        password: { type: String, require: true },
        phone: { type: String, default: '' },
        sex: { type: Number, default: 0 },
        cart: { type: [Book], default: [] },
        total: { type: Number, default: 0 },
    },
    {
        collection: 'Account',
        timestamps: true,
    },
);

// Export
module.exports = mongoose.model('Account', Account);
