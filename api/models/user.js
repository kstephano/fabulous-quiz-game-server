const db = require ('../db_config/init')


class User {
    constructor(data){
        this.id = data.id
        this.username = data.username
        this.score = data.score
        this.lobby_id = data.lobby_id
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const usersData = await db.query(`SELECT * FROM users;`)
                const users = usersData.rows.map(u => new User(u))
                resolve(users);
            } catch (err) {
                reject("Error retrieving Users")
            }
        })
    }

    static findById(id) {
        return new Promise (async (resolve, reject) => {
            try {
                const userData = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
                const users = new User(userData.rows[0]);
                resolve(users);
            } catch (err) {
                reject("Error retrieving Users")
            }
        })
    }

    static findByGame (lobby_id) {
        return new Promise (async (resolve, reject) => {
            try {
                let usersData = await db.query(`SELECT * FROM users WHERE lobby_id = $1;`, [ lobby_id ]);
                const users = usersData.rows.map(u => new User(u))
                resolve (users)
            } catch (err) {
                reject('Error retrieving users');
            }
        });
    }

    static get leaderboard () {
        return new Promise (async (resolve, reject) => {
            try {
                let usersData = await db.query(`SELECT * FROM users ORDER BY SCORE DESC LIMIT 10;`);
                const users = usersData.rows.map(u => new User(u))
                resolve (users);
            } catch (err) {
                reject('Error retrieving users');
            }
        });
    }

    static getScoreList (lobby_id) {
        return new Promise (async (resolve, reject) => {
            try {
                let usersData = await db.query(`SELECT * FROM users WHERE lobby_id = $1 ORDER BY SCORE DESC;`, [ lobby_id ]);
                const user = usersData.rows.map(u => new User(u))
                resolve (user);
            } catch (err) {
                reject('Error retrieving results');
            }
        });
    }

    static create(username, score, lobby_id){
        return new Promise (async (resolve, reject) => {
            try {
                let userData = await db.query("INSERT INTO users (username, score, lobby_id) VALUES ($1, $2, $3) RETURNING *;", [ username, score, lobby_id ]);
                let newUser = new User(userData.rows[0]);
                resolve (newUser);
            } catch (err) {
                reject(`Error creating User: ${err}`);
            }
        });
    }

    static update(id, score) {
        return new Promise (async (resolve, reject) => {
            try {
                let updatedUserData = await db.query('UPDATE users SET score = $2 WHERE id = $1 RETURNING *;', [ id, score ]);
                let updatedUser = new User(updatedUserData.rows[0]);
                resolve (updatedUser);
            } catch (err) {
                reject('Error updating User');
            }
        });
    }

  static destroy(id){
        return new Promise(async (res, rej) => {
            try {
                await db.query("DELETE FROM users WHERE id = $1;", [id]);
                res('User was deleted')
            } catch (err) {
                rej(`Error deleting user: ${err}`)
            }
        })
      }


}

module.exports = User;