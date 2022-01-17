const app = require("./server");
const io = require('socket.io')(4000, {
    cors: {
        origin: [ 'http://localhost:8080'],
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Express departed from port ${port}`))

io.on("connect", socket => {
    console.log(socket.id);
})