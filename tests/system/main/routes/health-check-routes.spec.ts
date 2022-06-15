import request from "supertest";
import app from "../../../../src/main/config/app";
describe("Health Check Routes", () => {
  describe("POST /health-check", () => {
    it("Should return 200 on health-check", async () => {
      await request(app)
        .get("/api/health-check")
        .expect(200);
    });
  });
});
