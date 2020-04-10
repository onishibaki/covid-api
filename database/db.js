//import mongoose db
const mongoose = require('mongoose');

//db connection
exports.dbConnector = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser : true, useUnifiedTopology: true }
    )
    .then(() => console.log("DB Connected"));

    //return error in db connection
    mongoose.connection.on('error', err => {
        console.log(`DB connectiom error: ${err.message}`);
    });
};