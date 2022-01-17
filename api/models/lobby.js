const db = require ('../db_config/init')

class Lobby {
    constructor(data){
        this.id = data.id
        this.category = data.category
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




    static create(category){
        return new Promise (async (resolve, reject) => {
            try {
                let gameData = await db.query(`INSERT INTO lobbies (category) VALUES ($1) RETURNING *;`, [ category ]);
                let newGame = new Lobby(gameData.rows[0]);
                resolve (newGame);
            } catch (err) {
                reject('Error creating Game');
            }
        });
    }

}

module.exports = Lobby;