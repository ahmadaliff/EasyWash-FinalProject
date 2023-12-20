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
    deleteUser: jest.fn(),
    restoreUsers: jest.fn(),
  };
  return { chatStreamClient };
});

let adminToken;
let userToken;
let idUserToDelete;
let idUserToVerify;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      fullName: "admin4",
      email: "admin4@user.com",
      role: "admin",
      imagePath: null,
      isVerified: true,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "user",
      email: "user5@user.com",
      role: "user",
      imagePath: null,
      isVerified: true,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "user2",
      email: "user2@user.com",
      role: "merchant",
      imagePath: null,
      isVerified: false,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const dataUserLogin = {
    email: "user5@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };
  const loginUser = await request(app)
    .post("/api/auth/login")
    .send(dataUserLogin);
  userToken = loginUser.body.token;

  const dataAdminLogin = {
    email: "admin4@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };
  const loginAdmin = await request(app)
    .post("/api/auth/login")
    .send(dataAdminLogin);
  adminToken = loginAdmin.body.token;
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {});
});

describe("Get All users verified", () => {
  test("Success get all users with status 200", (done) => {
    request(app)
      .get("/api/admin/users")
      .set("authorization", `Bearer ${adminToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("totalPage");
        expect(body).toHaveProperty("totalRows");
        idUserToDelete = body.data[0].id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed get all users cause user not admin with status 401", (done) => {
    request(app)
      .get("/api/admin/users")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_unathorize_auto");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get All users unverified", () => {
  test("Success get all users with status 200", (done) => {
    request(app)
      .get("/api/admin/users/unverified")
      .set("authorization", `Bearer ${adminToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("totalPage");
        expect(body).toHaveProperty("totalRows");
        idUserToVerify = body.data[0].id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed get all users cause user not admin with status 401", (done) => {
    request(app)
      .get("/api/admin/users/unverified")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_unathorize_auto");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Delete user or decline user", () => {
  test("Success delete user with status 200", (done) => {
    request(app)
      .delete("/api/admin/user/delete")
      .set("authorization", `Bearer ${adminToken}`)
      .send({ id: idUserToDelete })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_user_deleted");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Verify User", () => {
  test("Success verify user with status 200", (done) => {
    request(app)
      .put("/api/admin/user/verify")
      .set("authorization", `Bearer ${adminToken}`)
      .send({ id: idUserToVerify })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_account_verified");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed verify user cause not found with status 404", (done) => {
    request(app)
      .put("/api/admin/user/verify")
      .set("authorization", `Bearer ${adminToken}`)
      .send({ id: "99999" })
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
