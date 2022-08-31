// Import
const mongoose = require('mongoose');
const MongooseSlug = require('mongoose-slug-generator');

// Global variables
const Schema = mongoose.Schema;

// Initial slug
mongoose.plugin(MongooseSlug);

// Book Schema
const Book = new Schema(
    {
        name: { type: String },
        arthur: { type: String },
        price: { type: Number },
        genres: { type: [String] },
        language: { type: String },
        description: { type: [String] },
        image: { type: String },
        slug: { type: String, unique: true },
        buy: { type: Number },
        click: { type: Number },
    },
    {
        collection: 'Book',
        timestamps: true,
    },
);

// Export
module.exports = mongoose.model('Book', Book);
