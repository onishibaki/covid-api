const express = require('express');
const app = express()
// import middleware
const morgan = require("morgan");
// import routes
const  postRoutes  = require('./routes/mainRoutes');
// import db
const  db  = require('./database/db');
//import bodyParser to parse the request body
const bodyParser = require('body-parser');
//load env variables
const dotenv = require('dotenv');
dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", postRoutes);

//db connection
db.dbConnector();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening port number: ${port}`);
});
 