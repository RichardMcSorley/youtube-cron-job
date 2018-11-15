// used for deployment with ziet's now platform
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Still running jobs...");
});
server.listen(process.env.PORT);