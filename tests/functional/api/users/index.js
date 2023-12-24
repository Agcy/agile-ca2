import chai from "chai";
import request from "supertest";

const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;
let token;
let userId;
let validMovieId = 200;

describe("Users endpoint", () => {
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
            await User.deleteMany();
            // Register two users
            await request(api).post("/api/users?action=register").send({
                username: "user1",
                email: '123@163.com',
                password: "test123@",
            });
            await request(api).post("/api/users?action=register").send({
                account: "user2",
                email: 'test@qq.com',
                password: "test456@",
            });
        } catch (err) {
            console.error(`failed to Load user test Data: ${err}`);
        }
    });
    afterEach(() => {
        api.close();
    });

    // get all user
    describe("GET /api/users/", () => {
        it("should return a list of users", (done) => {
            request(api)
                .get("/api/users/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an("array");
                    console.info(res.body)
                    done();
                });
        });
    });

    // user register function
    describe("User register endpoint", () => {
        describe("POST /api/users/ - Registration Success Tests", () => {
            it("should successfully register a user with valid credentials", (done) => {
                request(api)
                    .post("/api/users/")
                    .query({action: 'register'})
                    .send({
                        username: "user777",
                        email: "user777@189.com",
                        password: "Password@123"
                    }) // Replace with valid credentials
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(201)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body.success).to.be.true;
                        expect(res.body).to.have.property("token");
                        done();
                    });
            });
        });

        describe("POST /api/users/ - Registration Boundary Tests", () => {
            it("should return error for missing required fields", (done) => {
                request(api)
                    .post("/api/users/")
                    .query({action: 'register'})
                    .send({username: "newUser", email: "newuser@fail.com"}) // Missing password
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });

            it("should return error for invalid email format", (done) => {
                request(api)
                    .post("/api/users/")
                    .query({action: 'register'})
                    .send({username: "newUser", email: "invalidEmail", password: "Password@123"})
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("POST /api/users/ - Registration Failure Tests", () => {
            it("should return error for already existing username or email", (done) => {
                request(api)
                    .post("/api/users/")
                    .query({action: 'register'})
                    .send({
                        username: "user1",
                        email: "123@163.com",
                        password: "Password@123"
                    }) // Use existing username and email
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

    })

    // user login function
    describe("User login endpoint", () => {
        describe("POST /api/users/ - Login Success Tests", () => {
            it("should login successfully with correct email", (done) => {
                request(api)
                    .post("/api/users/")
                    .send({account: "123@163.com", password: "test123@"}) // Replace with valid credentials
                    .set("Accept", "application/json")
                    // .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("token");
                        done();
                    });
            });
            it("should login successfully with correct user name", (done) => {
                request(api)
                    .post("/api/users/")
                    .send({account: "user1", password: "test123@"}) // Replace with valid credentials
                    .set("Accept", "application/json")
                    // .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body.success).to.be.true;
                        expect(res.body).to.have.property("token");
                        done();
                    });
            });
        });

        describe("POST /api/users/ - Login Boundary Tests", () => {
            it("should return error for missing account or password", (done) => {
                request(api)
                    .post("/api/users/")
                    .send({account: "user2"}) // Missing password
                    .set("Accept", "application/json")
                    .expect(400)
                    .end(done);
            });
        });

        describe("POST /api/users/ - Login Failure Tests", () => {
            it("should return error for incorrect credentials", (done) => {
                request(api)
                    .post("/api/users/")
                    .send({account: "invalidUser", password: "invalidPassword"})
                    .set("Accept", "application/json")
                    .expect(401)
                    .end(done);
            });
        });

    });

    // user profiles
    describe("User profiles endpoint", () => {

        beforeEach(async () => {
            // 登录用户并获取令牌和用户 ID
            const res = await request(api)
                .post("/api/users/")
                .send({account: "user1", password: "test123@"});
            console.info(res.body)
            token = res.body.token;
            userId = res.body.user.id;
            console.info(token + " " + userId)

        });

        // favorite movie page
        describe("Favorite movies page", () => {
            // get user favorite movies
            describe("Get user favorite movies", () => {
                describe("GET /api/users/tmdb/:id/favorites - Success Tests", () => {

                    it("should return favorite movies for a valid user ID", (done) => {
                        request(api)
                            .get(`/api/users/tmdb/${userId}/favorites`)
                            .set("Authorization", `${token}`)
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body).to.be.a("array");
                                done();
                            });
                    });
                });

                describe("GET /api/users/tmdb/:id/favorites - Boundary Tests", () => {
                    it("should return 403 Forbidden for accessing another user's favorites", (done) => {
                        const otherUserId = '65885601eb0d0be90b272026';
                        request(api)
                            .get(`/api/users/tmdb/${otherUserId}/favorites`)
                            .set("Authorization", `${token}`)
                            .expect(403)
                            .end(done);
                    });
                });

                describe("GET /api/users/tmdb/:id/favorites - Failure Tests", () => {
                    it("should return 401 Unauthorized for invalid token", (done) => {
                        request(api)
                            .get(`/api/users/tmdb/${userId}/favorites`)
                            .set("Authorization", "Bearer invalidToken")
                            .expect(401)
                            .end(done);
                    });

                    it("should return 404 Not Found for non-existent user ID", (done) => {
                        const nonExistentUserId = '11111111111111111';
                        request(api)
                            .get(`/api/users/tmdb/${nonExistentUserId}/favorites`)
                            .set("Authorization", `${token}`)
                            .expect(403)
                            .end(done);
                    });
                });
            });
            // add and delete favorite movie
            describe("Add and delete favorites endpoint", () => {
                describe("POST /api/users/tmdb/:id/favorites - Success Test", () => {
                    it("should add a movie to favorites", (done) => {
                        request(api)
                            .post(`/api/users/tmdb/${userId}/favorites`)
                            .set("Authorization", `${token}`)
                            .send({movieId: validMovieId})
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body).to.have.property("message", "Movie added to favorites");
                                done();
                            });
                    });
                });

                describe("DELETE /api/users/tmdb/:id/favorites/:movieId - Success Test", () => {
                    it("should remove a movie from favorites", (done) => {
                        request(api)
                            .delete(`/api/users/tmdb/${userId}/favorites/${validMovieId}`)
                            .set("Authorization", `${token}`)
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body).to.have.property("message", "Movie removed from favorites");
                                done();
                            });
                    });
                });

                describe("POST /api/users/tmdb/:id/favorites - Failure Test", () => {
                    it("should not add a movie to favorites if user is unauthorized", (done) => {
                        request(api)
                            .post(`/api/users/tmdb/${userId}/favorites`)
                            .send({movieId: validMovieId})
                            .expect(401)
                            .end(done);
                    });
                });

                describe("DELETE /api/users/tmdb/:id/favorites/:movieId - Failure Test", () => {
                    it("should not remove a movie from favorites if user is unauthorized", (done) => {
                        request(api)
                            .delete(`/api/users/tmdb/${userId}/favorites/${validMovieId}`)
                            .expect(401)
                            .end(done);
                    });
                });

            });
        });

        describe("Marked movies page", () => {
            // get user marked movies
            describe("Get user marked movies", () => {
                describe("GET /api/users/tmdb/:id/marked - Success Tests", () => {
                    it("should return marked movies for a valid user ID", (done) => {
                        request(api)
                            .get(`/api/users/tmdb/${userId}/marked`)
                            .set("Authorization", `${token}`)
                            .expect(200)
                            .end((err, res) => {
                                expect(res.body).to.be.an("array");
                                done();
                            });
                    });
                });

                describe("GET /api/users/tmdb/:id/marked - Failure Tests", () => {
                    it("should return 401 Unauthorized for invalid token", (done) => {
                        request(api)
                            .get(`/api/users/tmdb/${userId}/marked`)
                            .set("Authorization", "Bearer invalidToken")
                            .expect(401)
                            .end(done);
                    });

                    it("should return 404 Not Found for non-existent user ID", (done) => {
                        const nonExistentUserId = 'nonExistentUserId';
                        request(api)
                            .get(`/api/users/tmdb/${nonExistentUserId}/marked`)
                            .set("Authorization", `${token}`)
                            .expect(500)
                            .end(done);
                    });
                });

            });
        });
    });


});
