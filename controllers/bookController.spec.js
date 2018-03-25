const should = require('should'),
      sinon = require('sinon');

describe('bookController', () => {
  describe('post()', () => {
    it('should not allow an empty title on post', () => {
      const Book = function(book) {
        this.save = () => {};
      };

      const req = {
        body: {
          author: 'Some Author'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy()
      };

      const bookController = require('../controllers/bookController')(Book);

      bookController.post(req, res);

      res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0]);
      res.send.calledWith('Request body is incomplete').should.equal(true);
    });
  });
});