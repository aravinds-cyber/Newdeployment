const http = require('http');
const port = 3000;
const version = process.env.APP_VERSION || 'v1';

const requestHandler = (request, response) => {
  response.end(`Hello from Kubernetes! Version: ${version}\n`);
};

const server = http.createServer(requestHandler);
server.listen(port, () => {
  console.log(`Server running on port ${port} | ${version}`);
});

