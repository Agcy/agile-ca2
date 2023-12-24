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

  // user login function
  describe("User login endpoint", () => {
    describe("POST /api/users/ - Login Success Tests", () => {
      it("should login successfully with correct email", (done) => {
        request(api)
            .post("/api/users/")
            .send({ account: "7654@163.com", password: "Liang@@##123" }) // Replace with valid credentials
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


  // describe("POST /api/users ", () => {
  //   describe("For a register action", () => {
  //     describe("when the payload is correct", () => {
  //       it("should return a 201 status and the confirmation message", () => {
  //         return request(api)
  //           .post("/api/users?action=register")
  //           .send({
  //             username: "user3",
  //             password: "test123@",
  //           })
  //           .expect(201)
  //           .expect({ msg: "Successful created new user.", code: 201 });
  //       });
  //       after(() => {
  //         return request(api)
  //           .get("/api/users")
  //           .set("Accept", "application/json")
  //           .expect(200)
  //           .then((res) => {
  //             expect(res.body.length).to.equal(3);
  //             const result = res.body.map((user) => user.username);
  //             expect(result).to.have.members(["user1", "user2", "user3"]);
  //           });
  //       });
  //     });
  //   });
  //   describe("For an authenticate action", () => {
  //     describe("when the payload is correct", () => {
  //       it("should return a 200 status and a generated token", () => {
  //         return request(api)
  //           .post("/api/users?action=authenticate")
  //           .send({
  //             username: "user1",
  //             password: "test123@",
  //           })
  //           .expect(200)
  //           .then((res) => {
  //             expect(res.body.success).to.be.true;
  //             expect(res.body.token).to.not.be.undefined;
  //             user1token = res.body.token.substring(7);
  //           });
  //       });
  //     });
  //   });
  // });
});
