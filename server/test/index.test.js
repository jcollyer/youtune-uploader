const express = require('express');
const request = require('supertest');
const routes = require('../../api/routes');

describe('The Server', () => {
  const app = express();
  app.use('/', routes);

  test('returns HTML on an unknown endpoint', done => {
    request(app)
      .get('/*')
      .expect(response => expect(response.header['content-type']).toContain('text/html'))
      .then(() => done())
      .catch(err => done(err));
  });
});
