const mongoose = require('mongoose');

module.exports.connect = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb+srv://admin-femi:oluwafemi@cluster0.ulvxftn.mongodb.net/bibleDB');
} 