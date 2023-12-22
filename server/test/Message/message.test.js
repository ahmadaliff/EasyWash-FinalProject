const request = require("supertest");
const CryptoJS = require("crypto-js");

require("dotenv").config();

const app = require("../../index");
const { sequelize } = require("../../models/index");
const { hashPassword } = require("../../utils/bcryptUtil");
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));
jest.mock("../../utils/streamChatUtil", () => {
  const chatStreamClient = {
    upsertUser: jest.fn(),
    createToken: jest.fn(() => {
      return "token";
    }),
    queryChannels: jest.fn(({ cid }) => {
      if (cid !== "messaging:100-300") {
        return [];
      } else {
        return [1, 4];
      }
    }),
    channel: jest.fn(() => {
      return {
        create: jest.fn(),
      };
    }),
    deleteChannels: jest.fn(),
  };
  return { chatStreamClient };
});

let laundryToken;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      id: 100,
      fullName: "user",
      email: "user11@user.com",
      role: "user",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 300,
      fullName: "laundry",
      email: "laundry9@user.com",
      role: "merchant",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const dataLaundryLogin = {
    email: "laundry9@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };
  const loginLaundry = await request(app)
    .post("/api/auth/login")
    .send(dataLaundryLogin);

  laundryToken = loginLaundry.body.token;
});

afterAll(async () => {
  queryInterface.bulkDelete("Users", null, {});
});

describe("Get token streamchat", () => {
  test("Success get token with status 200", (done) => {
    request(app)
      .get("/api/chat/token")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("token");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("create channel streamchat", () => {
  test("return channel with status 200", (done) => {
    const data = {
      userId: 100,
    };
    request(app)
      .post("/api/chat/createChannel")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Success create channel with status 201", (done) => {
    const data = {
      userId: 300,
    };
    request(app)
      .post("/api/chat/createChannel")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_chat_created");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed create channel because id not found with status 404", (done) => {
    const data = {
      userId: 9999,
    };
    request(app)
      .post("/api/chat/createChannel")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_404");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Delete channel streamchat", () => {
  test("Success delete channel with status 200", (done) => {
    request(app)
      .delete("/api/chat/delete/100")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("deleted channel");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed delete channel with status 404", (done) => {
    request(app)
      .delete("/api/chat/delete/300")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_404");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
