const mongoose = require('mongoose');
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-server';

mongoose.connect(DB_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: false })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

    module.exports = {
        User: require('./user'),
};