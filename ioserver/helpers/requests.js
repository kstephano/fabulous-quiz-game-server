const axios = require("axios");
const url = "https://quiz-game-api-db.herokuapp.com";

/**
 *
 * @param {Number of questions} amount
 * @param {Number from 1-32 corresponding to a category} category
 * @param {Must be 'easy', 'medium', 'hard'} difficulty
 * @returns The response containing questions
 */
async function getQuestions(numOfQuestions, categoryId, difficulty) {
  const difficultyLowerCase = difficulty.toLowerCase();
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${categoryId}&difficulty=${difficultyLowerCase}&type=multiple`
    );
    const data = response.data.results;
    console.log(data);
    return data;
  } catch (error) {
    console.error(`(fetch) Error getting questions: ${error}`);
  }
}

async function createLobby(category, rounds, difficulty, roundLimit) {
  try {
    const response = await axios.post(`${url}/lobbies/`, {
      category: category,
      rounds: rounds,
      difficulty: difficulty,
      roundLimit: roundLimit,
    });
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error creating lobby: ${error}`);
  }
}

async function findLobbyById(lobbyId) {
  try {
    const response = await axios.get(`${url}/lobbies/id/${lobbyId}`);
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error finding lobby by id: ${error}`);
  }
}

async function deleteLobby(lobbyId) {
  try {
    const response = await axios.delete(`${url}/lobbies/${lobbyId}`);
    return `Lobby Deleted`;
  } catch (error) {
    console.error(`(fetch) Error deleting lobby with id: ${error}`);
  }
}

async function createUser(username, score = null, lobby_id) {
  try {
    const response = await axios.post(`${url}/users/`, {
      username: username,
      score: score,
      lobby_id: lobby_id,
    });
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error creating user: ${error}`);
  }
}

async function findUsersByGame(lobby_id) {
  try {
    const response = await axios.post(`${url}/users/lobby/${lobby_id}`);
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error creating user: ${error}`);
  }
}

async function updateUser(id, score) {
  try {
    const response = await axios.patch(`${url}/users/`, {
      id: id,
      score: score,
    });
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error updating user: ${error}`);
  }
}

async function deleteUser(id) {
  try {
    const response = await axios.delete(`${url}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`(fetch) Error deleting user: ${error}`);
  }
}

module.exports = {
  getQuestions,
  createLobby,
  findLobbyById,
  deleteLobby,
  createUser,
  findUsersByGame,
  updateUser,
  deleteUser,
};
