const http = require('http');
const supertest = require('supertest');

let server;

beforeAll(done => {
  server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end('Hello World');
  }).listen(4000, done);
});

afterAll(done => {
  server.close(done);
});

test('GET / should return Hello World', async () => {
  await supertest(server)
    .get('/')
    .expect(200)
    .expect('Hello World');
});