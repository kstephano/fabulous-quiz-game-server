const axios = require('axios');

/**
 * 
 * @param {Number of questions} amount 
 * @param {Number from 1-32 corresponding to a category} category 
 * @param {Must be 'easy', 'medium', 'hard'} difficulty 
 * @returns The response containing questions
 */
async function getQuestions(numOfQuestions, category, difficulty) {
    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getQuestions }