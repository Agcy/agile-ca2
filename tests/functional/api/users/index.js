import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;

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
        password: "test123@",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test123@",
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
            .query({ action: 'register' })
            .send({ username: "user777", email: "user777@189.com", password: "Password@123" }) // Replace with valid credentials
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
            .query({ action: 'register' })
            .send({ username: "newUser", email: "newuser@fail.com" }) // Missing password
            .set("Accept", "application/json")
            .expect(400)
            .end(done);
      });

      it("should return error for invalid email format", (done) => {
        request(api)
            .post("/api/users/")
            .query({ action: 'register' })
            .send({ username: "newUser", email: "invalidEmail", password: "Password@123" })
            .set("Accept", "application/json")
            .expect(400)
            .end(done);
      });
    });

    // describe("POST /api/users/ - Registration Failure Tests", () => {
    //   it("should return error for already existing username or email", (done) => {
    //     request(api)
    //         .post("/api/users/")
    //         .query({ action: 'register' })
    //         .send({ username: "user1", email: "123@163.com", password: "Password@123" }) // Use existing username and email
    //         .set("Accept", "application/json")
    //         .expect(400)
    //         .end(done);
    //   });
    // });

  })

  // user login function
  describe("User login endpoint", () => {
    describe("POST /api/users/ - Login Success Tests", () => {
      it("should login successfully with correct email", (done) => {
        request(api)
            .post("/api/users/")
            .send({ account: "test@qq.com", password: "test456@" }) // Replace with valid credentials
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
      it("should login successfully with correct user name", (done) => {
        request(api)
            .post("/api/users/")
            .send({ account: "user1", password: "test123@" }) // Replace with valid credentials
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
            .send({ account: "user2" }) // Missing password
            .set("Accept", "application/json")
            .expect(400)
            .end(done);
      });
    });

    describe("POST /api/users/ - Login Failure Tests", () => {
      it("should return error for incorrect credentials", (done) => {
        request(api)
            .post("/api/users/")
            .send({ account: "invalidUser", password: "invalidPassword" })
            .set("Accept", "application/json")
            .expect(401)
            .end(done);
      });
    });

  })


});
