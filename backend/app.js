const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:3001"
};


app.use(cors(corsOptions));

app.use(logger('dev'));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
require('./routes/auth')(app);
require('./routes/user')(app);

const db = require("./models");

db.mongoose
    .connect(`mongodb://${db.config.HOST}:${db.config.PORT}/${db.config.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

module.exports = app;
