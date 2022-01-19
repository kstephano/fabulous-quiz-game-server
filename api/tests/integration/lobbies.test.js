

describe("Lobbies endpoints", () => {
    let api;
    beforeEach(async () => {
      await resetTestDB();
    });
  
    beforeAll(async () => {
      api = app.listen(port, () =>
      console.log(`Test server running on port ${port}`)
      )});
  
    afterAll((done) => {
      console.log("Gracefully stopping test server");
      api.close(done);
    });
  
    it("should return a list of all lobbies in the database", async () => {
      const res = await request(api).get("/lobbies");
      expect(res.statusCode).toEqual(200);
     expect(res.body.games.length).toEqual(3);
      
    });
  
   
    it("should return lobbies by category", async () => {
      const res = await request(api).get("/lobbies/Sports");
      expect(res.statusCode).toEqual(200);
      expect(res.body[0].id).toEqual(3);
    });
  
  
    it("should create a new lobby", async () => {
      const res = await request(api).post("/lobbies").send({
        category: "Viking Mythology"
      });
      expect(res.statusCode).toEqual(200);
      const res2 = await request(api).get("/lobbies")
      expect(res2.body.games.length).toEqual(4);
    });

    it("should delete a lobby", async () => {
      const res2 = await request(api).get("/lobbies")
      console.log(res2.body)
      const res = await request(api).delete("/lobbies/1");
      console.log(res.body)
      
  
      expect(res.statusCode).toEqual(204);
  
      const lobbyRes = await request(api).get("/lobbies");
      console.log(lobbyRes.body)
      expect(lobbyRes.body.games.length).toBe(2);
    });
  
    });