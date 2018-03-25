const express = require('express'),
      mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/bookAPI');

const Book = require('./models/book');

const app = express();
const port = process.env.PORT || 3000;

const bookRouter = express.Router();

bookRouter.route('/Books')
  .get((req, res) => {
    const query = {};

    // limit query to genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    Book.find(query, (err, books) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(books);
      }
    });
  });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

app.listen(port, () => {
  console.log('Books API is running on PORT: ' + port);
});