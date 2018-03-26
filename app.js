const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      morgan = require('morgan');

let db;

if (process.env.ENV === 'test') {
  db = mongoose.connect('mongodb://localhost/bookAPI_test');
} else {
  db = mongoose.connect('mongodb://localhost/bookAPI');
}

const Book = require('./models/book');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Books API!');
});

app.listen(port, () => {
  debug(`Books API is running on PORT: ${chalk.green(port)}`);
});

module.exports = app;