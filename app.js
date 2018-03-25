const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');

const db = mongoose.connect('mongodb://localhost/bookAPI');

const Book = require('./models/book');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const bookRouter = express.Router();

bookRouter.route('/Books')
  .post((req, res) => {
    const book = new Book(req.body);

    book.save().then(() => {
      res.status(201).send(book);
    }).catch((err) => {
      res.status(400).send(err);
    });
  })
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

bookRouter.route('/Books/:bookId')
  .get((req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(book);
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