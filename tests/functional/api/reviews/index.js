import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
import User from "../../../../api/users/userModel";
// import {describe} from "mocha/lib/cli/run";

const expect = chai.expect;
let db;
let userId;
let token;

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
            await Review.deleteMany();
            // await Review.collection.insertMany(movies);
            // add two reviews
            await request(api).post("/api/reviews/tmdb/572802").send({
                movieId: 572802,
                userId: "6584bc8c54dd0c01c7144b37",
                author: "hpl",
                review: "hahahah hahahah hahah tooooo funnnyyyy",
                rating: 5
            });
            await request(api).post("/api/reviews/tmdb/466420").send({
                movieId: 466420,
                userId: "65844cef30ad0fbe23c6cf06",
                author: "hpl123",
                review: "My all time favorite movie, family, who know!!",
                rating: 5
            });
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
            // add two reviews
            await request(api).post("/api/reviews/tmdb/572802").send({
                movieId: 1345,
                userId: "65885601eb0d0be90b272025",
                author: "hpl",
                review: "hahahah hahahah hahah tooooo funnnyyyy",
                rating: 5
            });
            await request(api).post("/api/reviews/tmdb/572802").send({
                movieId: 1345,
                userId: "65885601eb0d0be90b272025",
                author: "1hpl1",
                review: "My all time favorite movie, family, who know!!",
                rating: 5
            });
            token = res.body.token;
            userId = res.body.user.id;

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
                    const invalidUserId = '8974634519864';
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
        describe("Add and delete user reviews", () => {

        })
    })
})
