var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');



var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', function(err) {
    if(err) {
        return console.log(err);
    }

    return console.log("Successfully connected to MongoDB!");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "uidz154dzdzd4z4cz894adzadza", resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, '/public')));
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.set('views', './views');
app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
