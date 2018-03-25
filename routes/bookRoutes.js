const express = require('express');

const routes = (Book) => {
  const bookRouter = express.Router();

  const bookController = require('../controllers/bookController')(Book);
  bookRouter.route('/')
    .post(bookController.post)
    .get(bookController.get);

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
    .get(bookController.getOne)
    .put(bookController.put)
    .patch(bookController.patch)
    .delete(bookController.delete);

  return bookRouter;
};

module.exports = routes;