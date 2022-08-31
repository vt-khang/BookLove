// Import
const mongoose = require('mongoose');

// Connect to database function
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://vtkhang:3012@bookcluster.vyeqlnn.mongodb.net/BookLove');
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failure');
    }
}

// Export
module.exports = { connect };