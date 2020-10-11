require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');


// Connecting to MongodDB
// Get the address of connection from Environment variable or use the default one
// Heroku is configured to inject DB_CONNECTION automatically
// https://dashboard.heroku.com/apps/btrack-wm/settings -> Reveaul Configs Vars
mongoose
  .connect(process.env.DB_CONNECTION || 'mongodb://localhost/btrack', {
    useNewUrlParser: true,
    createIndex: true
  })
  .then(x => {
    console.log(`Connectedd to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({
  layoutsDir: path.join(__dirname, 'views'),
  defaultLayout: 'layout',
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 10000000
  }
}));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';
const index = require('./routes/index');
app.use('/', index);
const login = require('./routes/login');
app.use('/login', login);
const signup = require('./routes/signup');
app.use('/signup', signup);
const user = require('./routes/user');
app.use('/user', user);
const bugs= require('./routes/bugs');
app.use('/bugs', bugs);
const dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);
const services = require('./routes/services');
app.use('/services', services);

module.exports = app;
