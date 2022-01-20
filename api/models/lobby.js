const db = require ('../db_config/init')

class Lobby {
    constructor(data){
        this.id = data.id
        this.category = data.category
        this.rounds = data.rounds
        this.difficulty = data.difficulty
        this.roundLimit = data.roundlimit
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const gamesData = await db.query(`SELECT * FROM lobbies;`)
                const games = gamesData.rows.map(g => new Lobby(g))
                resolve(games);
            } catch (err) {
                reject("Error retrieving Games")
            }
        })
    }

    static findByID(id){
        return new Promise (async (resolve, reject) => {
            try {
                let lobbyData = await db.query("SELECT * FROM lobbies WHERE id = $1;", [ id ]);
                const lobby = new Lobby(lobbyData.rows[0]);
                resolve (lobby)
            } catch (err) {
                reject('Error retrieving users');
            }
        });
    }

    static findByCategory (category) {
        return new Promise (async (resolve, reject) => {
            try {
                let gamesData = await db.query(`SELECT * FROM lobbies WHERE category = $1;`, [ category ]);
                const games = gamesData.rows.map(g => new Lobby(g))
                resolve (games);
            } catch (err) {
                reject('Error retrieving games');
            }
        });
    }

    static create(category, rounds, difficulty, roundLimit){
        return new Promise (async (resolve, reject) => {
            try {
                let gameData = await db.query("INSERT INTO lobbies (category, rounds, difficulty, roundLimit) VALUES ($1, $2, $3, $4 ) RETURNING *;", [ category, rounds, difficulty, roundLimit ]);
                let newGame = new Lobby(gameData.rows[0]);
                resolve (newGame);
            } catch (err) {
                reject(`Error creating game: ${err}`);
            }
        });
    }

    static destroy(id) {
        return new Promise(async (res, rej) => {
            try {
                await db.query("DELETE FROM lobbies WHERE id = $1;", [id]);
                res('Lobby was deleted')
            } catch (err) {
                rej(`Error deleting lobby: ${err}`)
            }
        });
      }
}

module.exports = Lobby;