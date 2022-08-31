// Import
const mongoose = require('mongoose');
const MongooseSlug = require('mongoose-slug-generator');

// Global variables
const Schema = mongoose.Schema;

// Initial slug
mongoose.plugin(MongooseSlug);

// Book Schema
const Book = new Schema({
    name: { type: String },
    price: { type: Number },
    image: { type: String },
    slug: { type: String },
    quantity: { type: Number },
    total: { type: Number },
});
// Bill Schema
const Bill = new Schema(
    {
        username: { type: String },
        name: { type: String },
        book: { type: [Book], default: [] },
        address: { type: String },
        phone: { type: String },
        total: { type: Number },
    },
    {
        collection: 'Bill',
        timestamps: true,
    },
);

// Export
module.exports = mongoose.model('Bill', Bill);
