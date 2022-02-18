const server = require("./io");
const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`Socket server departed from http://localhost:${port}`)
);
