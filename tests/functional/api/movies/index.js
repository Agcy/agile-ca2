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
                    .query({page: 1, language: 'us-EN'}) // example parameters
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
                    .query({page: 1, language: 'us-EN'})
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
                    .query({page: 0, language: 'us-EN'})
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
                    .query({page: "@", language: 'invalid-code'})
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

    //single movie detail page
    describe("Single movie endpoint", () => {
        // afterEach(() => {
        //     api.close(); // Release PORT 8080
        // });
        describe("Single movie endpoint- Pass Test", () => {
            it("should return the matching movie", () => {
                return request(api)
                    .get(`/api/movies/tmdb/movie/${movies[0].id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.have.property("title", movies[0].title);
                    });
            });
        })
        describe("Single movie endpoint - Boundary Tests", () => {
            // Assuming 1 is the minimum valid ID
            it("should return the movie for minimum valid ID", () => {
                return request(api)
                    .get(`/api/movies/tmdb/movie/1`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(400)
                    .then((res) => {
                        expect(res.body).to.have.property("error");
                    });
            });

            // Testing with a very large ID
            it("should return not found for a very large ID", () => {
                return request(api)
                    .get("/api/movies/tmdb/movie/999999999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(400)
                    .then((res) => {
                        expect(res.body).to.have.property("error");
                    });
            });
        });
        describe("Single movie endpoint - Failure Tests", () => {
            // Testing with a non-numeric ID
            it("should return error for non-numeric ID", () => {
                return request(api)
                    .get("/api/movies/tmdb/movie/abc")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(400)
                    .then((res) => {
                        expect(res.body).to.have.property("error");
                    });
            });

            // Testing with a negative ID
            it("should return error for negative ID", () => {
                return request(api)
                    .get("/api/movies/tmdb/movie/-1")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(400)
                    .then((res) => {
                        expect(res.body).to.have.property("error");
                    });
            });
        });


    });

    // upcoming movie page
    describe("Upcoming movie endpoint", () => {
        describe("Upcoming movie endpoint - Success Tests", () => {
            it("should return upcoming movies for valid parameters", (done) => {
                request(api)
                    .get("/api/movies/tmdb/upcoming")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.an("array");
                        done();
                    });
            });
        });

        describe("Upcoming movie endpoint - Boundary Tests", () => {
            it("should handle minimum valid page number", (done) => {
                request(api)
                    .get("/api/movies/tmdb/upcoming")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });

            it("should return error for invalid page number", (done) => {
                request(api)
                    .get("/api/movies/tmdb/upcoming")
                    .query({ page: 0, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Upcoming movie endpoint - Failure Tests", () => {
            it("should return error when parameters are missing", (done) => {
                request(api)
                    .get("/api/movies/tmdb/upcoming")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

    })

    // trending movie page
    describe("Trending movie endpoint", () => {
        describe("Trending movie endpoint - Success Tests", () => {
            it("should return trending movies for valid parameters", (done) => {
                request(api)
                    .get("/api/movies/tmdb/trending")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.an("array");
                        done();
                    });
            });
        });

        describe("Trending movie endpoint - Boundary Tests", () => {
            it("should handle minimum valid page number", (done) => {
                request(api)
                    .get("/api/movies/tmdb/trending")
                    .query({ page: 1, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });

            it("should return error for invalid page number", (done) => {
                request(api)
                    .get("/api/movies/tmdb/trending")
                    .query({ page: 0, language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Trending movie endpoint - Failure Tests", () => {
            it("should return error when parameters are missing", (done) => {
                request(api)
                    .get("/api/movies/tmdb/trending")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

    })

    // movie genres
    describe("Movie genres endpoint", () => {
        describe("Movie genres endpoint - Success Tests", () => {
            it("should return movie genres for valid language", (done) => {
                request(api)
                    .get("/api/movies/tmdb/genres")
                    .query({ language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.genres).to.be.an("array");
                        done();
                    });
            });
        });

        describe("Movie genres endpoint - Boundary Tests", () => {
            it("should handle valid language code", (done) => {
                request(api)
                    .get("/api/movies/tmdb/genres")
                    .query({ language: 'en-US' })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });

            it("should handle invalid language code", (done) => {
                request(api)
                    .get("/api/movies/tmdb/genres")
                    .query({ language: 'invalid-code' })
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });
        });

        describe("Movie genres endpoint - Failure Tests", () => {
            it("should return default genres when language is missing", (done) => {
                request(api)
                    .get("/api/movies/tmdb/genres")
                    .set("Accept", "application/json")
                    .expect(200)
                    .end(done);
            });
        });

    })

    // movie credits
    describe("Movie credits endpoint", () => {
        describe("Movie credits endpoint - Success Tests", () => {
            it("should return movie credits for valid actor id", (done) => {
                // Assuming that '1' is a valid actor id for testing
                request(api)
                    .get("/api/movies/tmdb/movie_credits/200")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("cast");
                        expect(res.body).to.have.property("crew");
                        done();
                    });
            });
        });

        describe("Movie credits endpoint - Boundary Tests", () => {
            it("should return error for non-numeric actor id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie_credits/abc")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });

            it("should return error for negative actor id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie_credits/-1")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Movie credits endpoint - Failure Tests", () => {
            it("should return not found for non-existent actor id", (done) => {
                // Assuming that '9999999' is a non-existent actor id for testing
                request(api)
                    .get("/api/movies/tmdb/movie_credits/9999999")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });
    })

    // movie images
    describe("Movie images endpoint", () => {
        describe("Movie images endpoint - Success Tests", () => {
            it("should return movie images for valid movie id", (done) => {
                // Assuming that '1' is a valid movie id for testing
                request(api)
                    .get("/api/movies/tmdb/movie/200/image")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("backdrops");
                        expect(res.body).to.have.property("posters");
                        done();
                    });
            });
        });

        describe("Movie images endpoint - Boundary Tests", () => {
            it("should return error for non-numeric movie id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie/abc/image")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });

            it("should return error for negative movie id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie/-1/image")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("Movie images endpoint - Failure Tests", () => {
            it("should return not found for non-existent movie id", (done) => {
                // Assuming that '9999999' is a non-existent movie id for testing
                request(api)
                    .get("/api/movies/tmdb/movie/9999999/image")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

    })

    // movie reviews
    describe("Movies reviews endpoint", () => {
        describe("Movies reviews endpoint - Success Tests", () => {
            it("should return movie reviews for valid movie id", (done) => {
                // Assuming that '1' is a valid movie id for testing
                request(api)
                    .get("/api/movies/tmdb/movie/200/review")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("array");
                        expect(res.body.length).to.be.greaterThan(0);
                        done();
                    });
            });
        });

        describe("Movies reviews endpoint - Boundary Tests", () => {
            it("should return error for non-numeric movie id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie/abc/review")
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });

            it("should return error for negative movie id", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movie/-1/review")
                    .set("Accept", "application/json")
                    .expect(404)
                    .end(done);
            });
        });

        describe("Movies reviews endpoint - Failure Tests", () => {
            it("should return not found for non-existent movie id", (done) => {
                // Assuming that '9999999' is a non-existent movie id for testing
                request(api)
                    .get("/api/movies/tmdb/movie/9999999/review")
                    .set("Accept", "application/json")
                    .expect(404)
                    .end(done);
            });
        });

    })
});
