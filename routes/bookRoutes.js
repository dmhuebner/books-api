const express = require('express');

const routes = (Book) => {
  const bookRouter = express.Router();

  bookRouter.route('/')
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

  // Middleware for :bookId routes
  bookRouter.use('/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        res.status(500).send(err);
      } else if (book) {
        req.book = book;
        next();
      } else {
        res.status(404).send('No book found');
      }
    });
  });

  bookRouter.route('/:bookId')
    .get((req, res) => {
      res.json(req.book);
    })
    .put((req, res) => {
      req.book.title = req.body.title;
      req.book.genre = req.body.genre;
      req.book.author = req.body.author;
      req.book.read = req.body.read;

      req.book.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.book);
        }
      });
    })
    .patch((req, res) => {
      if (req.body._id) {
        delete req.body._id;
      }
      for (let prop in req.body) {
        req.book[prop] = req.body[prop];
      }

      req.book.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.book);
        }
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('Removed');
        }
      });
    });

  return bookRouter;
};

module.exports = routes;