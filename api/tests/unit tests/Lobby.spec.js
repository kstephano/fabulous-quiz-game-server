const Lobby = require('../../models/lobby')
const pg = require('pg');
jest.mock('pg');

const db = require('../../db_config/init');

describe('Lobby', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())
            
    describe('all', () => {
        test('it resolves with lobbies on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Lobby.all;
            expect(all).toHaveLength(3)
        })
    });

    describe('create', () => {
        test('it resolves with lobby on successful db query', async () => {
            let lobbyData = { id: 1, category: 'Viking Mythology' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ lobbyData] });
            const result = await Lobby.create('New lobby');
            expect(result).toBeInstanceOf(Lobby)
        })
    });
    
    describe('findByGame', () => {
        test('it resolves with lobby on successful db query', async () => {
            let lobbyData = { id: 1, category: 'Viking Mythology' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ lobbyData] });
            const result = await Lobby.findByCategory(1);
            expect(result).toBeInstanceOf(Array)
        })
    });
})