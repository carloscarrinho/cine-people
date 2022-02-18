import request from "supertest";
import app from "../../../../src/main/config/app";

describe("Content Type", () => {
  it("Should set default Content-Type as json", async () => {
    const endpoint = "/test_content_type";

    app.get(endpoint, (req, res) => {
      res.send();
    });

    await request(app).get(endpoint).expect("content-type", /json/);
  });

  it("Should set Content-Type as xml if is set on endpoint", async () => {
    const endpoint = "/test_content_type_xml";

    app.get(endpoint, (req, res) => {
      res.type("xml");
      res.send();
    });

    await request(app).get(endpoint).expect("content-type", /xml/);
  });
});
