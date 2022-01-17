const app = require("./server");
const io = require('./io');
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Express departed from http://localhost:${port}`));

io.listen(4000, () => console.log(`Socket server departed from http://localhost:${4000}`));