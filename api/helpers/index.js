const isAllPlayersLoaded = (players) => {
    let value = true;
    for (let i = 0; i < players.length; i++) {
        if (players[i].score === null) {
            value = false;
        }
    }
    return value;
}

const disconnectedPlayerIds = (players) => {
    const ids = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].score === null) {
            ids.push(players[i].id);
        }
    }
    return ids;
}

module.exports = { isAllPlayersLoaded, disconnectedPlayerIds }
