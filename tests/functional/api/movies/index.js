import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;

describe("Movies endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
          done();
        });
    });
  });

  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/9999")
          .set("Accept", "application/json")
          .expect(404)
          .expect({
            status_code: 404,
            message: "The movie you requested could not be found.",
          });
      });
    });
  });

  // home page
  describe("Discover movies endpoint", () => {
    afterEach(() => {
      api.close(); // Release PORT 8080
    });

    describe("Discover movies endpoint - Pass Tests", () => {
      it("should return movies and a status 200", (done) => {
        request(api)
            .get("/api/movies/tmdb/home")
            .query({ page: 1, language: 'us-EN' }) // example parameters
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.be.a("object");
              expect(res.body).to.have.property("results");
              expect(res.body.results).to.be.a("array");
              done();
            });
      });
    });

    describe("Discover movies endpoint - Boundary Tests", () => {
      // Testing with minimum valid page number
      it("should handle minimum valid page number", (done) => {
        request(api)
            .get("/api/movies/tmdb/home")
            .query({ page: 1, language: 'us-EN' })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("results");
              expect(res.body.results).to.be.an("array");
              done();
            });
      });

      // Testing with invalid page number (e.g., 0 or negative)
      it("should return error for invalid page number", (done) => {
        request(api)
            .get("/api/movies/tmdb/home")
            .query({ page: 0, language: 'us-EN' })
            .set("Accept", "application/json")
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.have.property("error");
              done();
            });
      });
    });

    describe("Discover movies endpoint - Failure Tests", () => {
      // Testing with invalid language code
      it("should return error for invalid language code", (done) => {
        request(api)
            .get("/api/movies/tmdb/home")
            .query({ page: "@", language: 'invalid-code' })
            .set("Accept", "application/json")
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.have.property("error");
              done();
            });
      });

      // Testing with missing parameters
      it("should return error when parameters are missing", (done) => {
        request(api)
            .get("/api/movies/tmdb/home")
            .set("Accept", "application/json")
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.have.property("error");
              done();
            });
      });
    });

  });
});
