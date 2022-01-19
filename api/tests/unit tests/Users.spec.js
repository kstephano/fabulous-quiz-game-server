const User = require('../../models/user')
const pg = require('pg');
jest.mock('pg');

const db = require('../../db_config/init');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())
            
    describe('all', () => {
        test('it resolves with users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await User.all;
            expect(all).toHaveLength(3)
        })
    });



    
    describe('create', () => {
        test('it resolves with user on successful db query', async () => {
            let userData = { id: 1, username: 'New User' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ userData] });
            const result = await User.create('New User');
            expect(result).toBeInstanceOf(User)
        })
    });
})