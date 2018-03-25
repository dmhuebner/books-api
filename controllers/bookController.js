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
  }

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
  }

  return {
    post: post,
    get: get
  };
};

module.exports = bookController;