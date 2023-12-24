import chai from "chai";
import request from "supertest";

const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
// import {describe} from "mocha/lib/cli/run";

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

    describe("Stored Actor list endpoint", () => {
        describe("Stored Actor list endpoint - Success Tests", () => {
            it("should return a list of actors for valid page and limit", (done) => {
                request(api)
                    .get("/api/actors/")
                    .query({ page: 1, limit: 10 })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("page", 1);
                        expect(res.body).to.have.property("total_pages");
                        expect(res.body).to.have.property("total_results");
                        expect(res.body.results).to.be.an("array");
                        done();
                    });
            });
        });

        describe("Stored Actor list endpoint - Boundary Tests", () => {
            it("should handle minimum valid page and limit", (done) => {
                request(api)
                    .get("/api/actors/")
                    .query({ page: 1, limit: 1 })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });

            it("should return error for invalid page and limit values", (done) => {
                request(api)
                    .get("/api/actors/")
                    .query({ page: 0, limit: -1 })
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Stored Actor list endpoint - Failure Tests", () => {
            it("should return default page and limit when parameters are missing", (done) => {
                request(api)
                    .get("/api/actors/")
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("page", 1);
                        done();
                    });
            });
        });
    });

    // local single actor
    describe("Local single actor endpoint", () => {
        describe("Local single actor endpoint - Success Tests", () => {
            it("should return details of an actor for valid actor id", (done) => {
                // Assuming that '1' is a valid actor id for testing
                request(api)
                    .get("/api/actors/200")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        done();
                    });
            });
        });

        describe("Local single actor endpoint - Boundary Tests", () => {
            it("should return error for non-numeric actor id", (done) => {
                request(api)
                    .get("/api/actors/abc")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });

            it("should return error for negative actor id", (done) => {
                request(api)
                    .get("/api/actors/-1")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Local single actor endpoint - Failure Tests", () => {
            it("should return not found for non-existent actor id", (done) => {
                request(api)
                    .get("/api/actors/9999999")
                    .set("Accept", "application/json")
                    .expect(404)
                    .end(done);
            });
        });

    });

    describe("Popular actor endpoint", () => {
        describe("GET /api/actors/tmdb/actors - Success Tests", () => {
            it("should return a list of popular actors for valid page and language", (done) => {
                request(api)
                    .get("/api/actors/tmdb/actors")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("page");
                        expect(res.body).to.have.property("results").that.is.an("array");
                        done();
                    });
            });
        });

        describe("GET /api/actors/tmdb/actors - Boundary Tests", () => {
            it("should handle minimum valid page number", (done) => {
                request(api)
                    .get("/api/actors/tmdb/actors")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });

            it("should return error for invalid page number", (done) => {
                request(api)
                    .get("/api/actors/tmdb/actors")
                    .query({ page: 0, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("GET /api/actors/tmdb/actors - Failure Tests", () => {
            it("should return error for invalid page format", (done) => {
                request(api)
                    .get("/api/actors/tmdb/actors")
                    .query({ page: "@", language: 'invalid-code' })
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

    })

});
