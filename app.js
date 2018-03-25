const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');

const db = mongoose.connect('mongodb://localhost/bookAPI');

const Book = require('./models/book');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Books API!');
});

app.listen(port, () => {
  console.log('Books API is running on PORT: ' + port);
});