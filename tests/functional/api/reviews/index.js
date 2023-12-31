import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";
import reviews from "../../../../seedData/reviews";
import User from "../../../../api/users/userModel";
// import {describe} from "mocha/lib/cli/run";

const expect = chai.expect;
let db;
let userId;
let token;
let reviewId1
let reviewId2;

describe("Reviews endpoint", () => {
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
            await Review.deleteMany()
            await User.deleteMany()
            await request(api).post("/api/users?action=register").send({
                username: "user1",
                email: "123@123.com",
                password: "test123@"
            })
            // 登录用户并获取令牌和用户 ID
            const res = await request(api)
                .post("/api/users/")
                .send({account: "user1", password: "test123@"});
            token = res.body.token;
            userId = res.body.user.id;
            // 添加第一个评论
            const reviewRes1 = await request(api)
                .post("/api/reviews/tmdb/27017")
                .set("Authorization", `${token}`)
                .send({
                    movieId: 27017,
                    userId: userId,
                    author: "hpl",
                    review: "hahahah hahahah hahah tooooo funnnyyyy",
                    rating: 5
                });
            reviewId1 = reviewRes1.body._id;
            // 添加第二个评论
            const reviewRes2 = await request(api)
                .post("/api/reviews/tmdb/27017")
                .set("Authorization", `${token}`)
                .send({
                    movieId: 27017,
                    userId: userId,
                    author: "1hpl1",
                    review: "My all time favorite movie, family, who know!!",
                    rating: 5
                });
            reviewId2 = reviewRes2.body._id;
        } catch (err) {
            console.error(`failed to Load user Data: ${err}`);
        }
    });
    afterEach(() => {
        api.close(); // Release PORT 8080
    });

    // get all reviews
    describe("Get all local user reviews", () => {

        describe("GET /api/users/tmdb/all - Success Test", () => {
            it("should retrieve all reviews when they exist", (done) => {
                request(api)
                    .get("/api/reviews/tmdb/all")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("array");
                        if (res.body.length > 0) {
                            expect(res.body[0]).to.have.property("movieId");
                        }
                        done();
                    });
            });
        });

        describe("GET /api/users/tmdb/all - Failure Test", () => {
            beforeEach(async () => {
                await Review.deleteMany();
            })
            it("should return 404 when no reviews are found", (done) => {
                // 确保数据库中没有评论
                request(api)
                    .get("/api/reviews/tmdb/all")
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property("message", "No reviews found");
                        done();
                    });
            });
        });
    });

    // single user reviews page
    describe("My reviews page", () => {

        beforeEach(async () => {


        });
        // get single user reviews
        describe("Get Single user reviews", () => {
            describe("GET /api/reviews/tmdb/user/:userId - Success Test", () => {
                it("should retrieve all reviews for a valid user ID", (done) => {
                    request(api)
                        .get(`/api/reviews/tmdb/user/${userId}`)
                        .set("Authorization", `${token}`)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.be.an("array");
                            done();
                        });
                });
            });

            describe("GET /api/reviews/tmdb/user/:userId - Failure Test", () => {
                it("should return 404 when no reviews are found for a user", (done) => {
                    const invalidUserId = '654136413513546852';
                    request(api)
                        .get(`/api/reviews/tmdb/user/${invalidUserId}`)
                        .set("Authorization", `${token}`)
                        .expect(404)
                        .end((err, res) => {
                            expect(res.body).to.have.property("message", `Internal server error`);
                            done();
                        });
                });
            });
        })

        // add and delete user reviews
        describe("Add user reviews", () => {
            describe("POST /api/reviews/tmdb/:movieId - Success Test", () => {
                let movieId = "27017";

                it("should create a review successfully", (done) => {
                    request(api)
                        .post(`/api/reviews/tmdb/${movieId}`)
                        .set("Authorization", `${token}`)
                        .send({ userId: userId, author: "John Doe", review: "Great movie!", rating: 5 })
                        .expect(201)
                        .end((err, res) => {
                            expect(res.body).to.have.property("review", "Great movie!");
                            done();
                        });
                });
            });

            describe("POST /api/reviews/tmdb/:movieId - Failure Test", () => {
                it("should return error for invalid review data", (done) => {
                    request(api)
                        .post(`/api/reviews/tmdb/invalidMovieId`)
                        .set("Authorization", `${token}`)
                        .send({ author: "John Doe", review: "" }) // 缺少必要字段
                        .expect(500)
                        .end(done);
                });
            });


        })

        describe("Delete user reviews", () => {
            describe("DELETE /api/reviews/tmdb/:reviewId - Success Test", () => {


                it("should delete a review successfully", (done) => {
                    request(api)
                        .delete(`/api/reviews/tmdb/${reviewId1}`)
                        .set("Authorization", `${token}`)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.have.property("message", "Review deleted successfully");
                            done();
                        });
                });
            });

            describe("DELETE /api/reviews/tmdb/:reviewId - Failure Test", () => {
                it("should return error when review does not exist", (done) => {
                    request(api)
                        .delete(`/api/reviews/tmdb/65844cef30ad0fbe23c6cf06`)
                        .set("Authorization", `${token}`)
                        .expect(404)
                        .end((err, res) => {
                            expect(res.body).to.have.property("message","Review not found");
                            done();
                        });
                });
            });

        })
    })
})
