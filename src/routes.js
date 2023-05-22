const { addBookHandler } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: () => 'test Server',
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
];

module.exports = routes;
