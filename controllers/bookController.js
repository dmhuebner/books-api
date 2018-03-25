const bookController = (Book) => {

  const post = (req, res) => {
    const book = new Book(req.body);

    if (!req.body.title || !req.body.author) {
      res.status(400);
      res.send('Request body is incomplete');
    } else {
      book.save((err) => {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201);
          res.send(book);
        }
      });
    }
  };

  const get = (req, res) => {
    const query = {};

    // limit query to genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    Book.find(query, (err, books) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // add hypermedia to returned object
        let returnBooks = [];
        books.forEach((book) => {
          const newBook = book.toJSON();
          newBook.links = {
            self: 'http://' + req.headers.host + '/api/books/' + newBook._id
          };
          returnBooks.push(newBook);
        });

        res.json(returnBooks);
      }
    });
  };

  const getOne = (req, res) => {
    // add hypermedia to returned object
    const returnBook = req.book.toJSON();
    const filterByGenreLink = 'http://' + req.headers.host + '/api/books?genre=' + returnBook.genre;
    returnBook.links = {
      FilterByGenre: filterByGenreLink.replace(' ', '%20')
    };

    res.json(returnBook);
  };

  const put = (req, res) => {
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
  };

  const patch = (req, res) => {
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
  };

  const deleteBook = (req, res) => {
    req.book.remove((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send('Removed');
      }
    });
  };

  return {
    post: post,
    get: get,
    getOne: getOne,
    put: put,
    patch: patch,
    delete: deleteBook
  };
};

module.exports = bookController;