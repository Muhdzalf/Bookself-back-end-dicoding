const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: 'localhost',
  });

  server.route(routes);

  server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
