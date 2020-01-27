const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /books', () => {
  it('should return an array of books', () => {
    return supertest(app)
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          const book = res.body[0];
          expect(book).to.include.all.keys(
              'bestsellers_date', 'author', 'description', 'title'
          );
      });
  });

  it('should sort by title', () => {
      return supertest(app)
        .get('/books')
        .query({ sort: 'title'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
            let i = 0;
            while(i< res.body.length -1) {
                const bookAtI = res.body[i];
                const bookAtIPlus1 = res.body[i+1];
                if(bookAtIPlus1 < bookAtI.title) {
                    sorted = false;
                    break;
                }
                i++;
            }
            expect(sorted).to.be.true;
        })
  })
});