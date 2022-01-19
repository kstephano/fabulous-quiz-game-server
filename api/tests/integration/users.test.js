describe("users endpoints", () => {
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
  
    it("should return a list of all users in the database", async () => {
      const res = await request(api).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(res.body.users.length).toEqual(7);
    });
    
    it("should return a list of all users in the database", async () => {
      const res = await request(api).get("/users/leaderboard");
      expect(res.statusCode).toEqual(200);
      expect(res.body.users[0].username).toEqual("Peter");
    });
    
    it("should return a list of all users in the database", async () => {
      const res = await request(api).get("/users/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body.users.length).toEqual(3);
    });

    it("should create a new user", async () => {
      const res = await request(api).post("/users").send({
        username: 'RhysCairns',
        score: 0.8,
        lobby_id: 3
      });
      expect(res.statusCode).toEqual(200);  
      expect(res.body.id).toEqual(8);
    });

    it("should delete a user", async () => {
      const res = await request(api).delete("/users/2");
      const res2 = await request(api).get("/users");
      expect(res.statusCode).toEqual(204);
  
      const userRes = await request(api).get("/users");
      expect(userRes.body.users.length).toBe(6);
    });
    });