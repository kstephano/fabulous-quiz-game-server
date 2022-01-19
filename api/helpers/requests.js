const axios = require('axios');

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
        const response = await axios.get(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${categoryId}&difficulty=${difficultyLowerCase}&type=multiple`);
        const data = response.data.results;
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getQuestions }