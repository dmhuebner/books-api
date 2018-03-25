const should = require('should'),
      request = require('supertest'),
      app = require('../app.js'),
      mongoose = require('mongoose'),
      Book = mongoose.model('Book'),
      agent = request.agent(app);

describe('Book CRUD tests', () => {
  describe('post()', () => {
    it('should allow a book to be posted and return properties: read, _id', (done) => {
      const bookPost = {title: 'New Book', author: 'Dave', genre: 'fiction'};

      agent.post('/api/books')
        .send(bookPost)
        .expect(200)
        .end((err, results) => {
          results.body.read.should.equal(false);
          results.body.should.have.property('_id');
          done();
        });
    });
  });

  afterEach((done) => {
    Book.remove().exec();
    done();
  });
});