/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let documentInDB =null;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {
//if book exist there should be an id and title..
      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post("/api/books")
          .send({ "title": "title" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isOk(res.body._id);
            assert.equal(res.body.title, "title");
            documentInDB=res.body._id;
            done();
          })

      });
//has to be a title in order to post..
      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {
//should be an array of books and arranged accordingly..
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);

            assert.isArray(res.body);

            done();
          })

      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {
//if no id book no exist..
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get("/api/books/toi")
          .end((err, res) => {
            assert.equal(res.status, 200);

            assert.equal(res.text, "no book exists");

            done();
          })
      });
//if valid id there has to be a title...so not null..
      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get("/api/books/"+documentInDB)
          .end((err, res) => {
            assert.equal(res.status, 200);

            assert.isNotNull(res.body.title);

            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
//if comment added successfully, comment count should increase..
      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post("/api/books/"+documentInDB)
          .send({ "comment": "title comment" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isOk(res.body._id);
            assert.isAbove(res.body.commentcount, 0);
            done();
          })
      });
//comment is required...
      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post("/api/books/"+documentInDB)

          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");

            done();
          })
      });
//if no id book no exist...
      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post("/api/books/pos")
          .send({ "comment": "title comment" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");

            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {
//if valid id delete successful
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete("/api/books/"+documentInDB)
         
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");

            done();
          })
      });
//if no id no book exists..
      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
        .delete("/api/books/calm")
       
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");

          done();
        })
      });

    });

  });

});
