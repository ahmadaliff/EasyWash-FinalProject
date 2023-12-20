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
  };
  return { chatStreamClient };
});
jest.mock("multer", () => {
  const multer = () => ({
    single: () => {
      return (req, res, next) => {
        if (
          req.headers["content-type"] &&
          req.headers["content-type"].includes("multipart/form-data")
        ) {
          req.file = {
            originalname: "sample.name",
            mimetype: "sample.type",
            path: "sample.url",
          };
        }
        return next();
      };
    },
  });
  multer.diskStorage = () => jest.fn();
  return multer;
});

let userToken;
let laundryToken;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      id: 1,
      fullName: "user",
      email: "user@user.com",
      role: "user",
      imagePath: null,
      isVerified: true,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      fullName: "laundry",
      email: "laundry@user.com",
      role: "merchant",
      imagePath: null,
      isVerified: true,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("Merchants", [
    {
      id: 1,
      name: "Laundry 1",
      userId: 3,
      description: "ini adalah description",
      imagePath: null,
      location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Laundry 2",
      userId: 1,
      description: "ini adalah description",
      imagePath: null,
      location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("Services", [
    {
      id: 1,
      name: "Cuci Reguler Kiloan",
      merchantId: 1,
      price: 6000,
      isUnit: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Cuci Reguler Satuan Baju",
      merchantId: 3,
      price: 8000,
      isUnit: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("Orders", [
    {
      id: `Order-1702535973296`,
      userId: 1,
      totalPrice: 12000,
      status: "app_payment",
      location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
      midtransToken: "token",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const dataUserLogin = {
    email: "user@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };

  const loginUser = await request(app)
    .post("/api/auth/login")
    .send(dataUserLogin);
  userToken = loginUser.body.token;

  const dataLaundryLogin = {
    email: "laundry@user.com",
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
  await queryInterface.bulkDelete("Users", null, {});
  await queryInterface.bulkDelete("Merchants", null, {});
  await queryInterface.bulkDelete("Services", null, {});
  await queryInterface.bulkDelete("Orders", null, {});
});

describe("Get All services in a laundry", () => {
  test("Success get all service with status 200", (done) => {
    request(app)
      .get("/api/laundry/services")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("totalPage");
        expect(body).toHaveProperty("totalRows");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed get all service cause role not merchant with status 401", (done) => {
    request(app)
      .get("/api/laundry/services")
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

describe("Add Service", () => {
  test("Success add service with status 201", (done) => {
    const data = {
      name: "Baju",
      price: 31231,
      isUnit: false,
    };
    request(app)
      .post("/api/laundry/service/add")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_service_created");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed add service already exist with status 400", (done) => {
    const data = {
      name: "Baju",
      price: 31231,
      isUnit: false,
    };
    request(app)
      .post("/api/laundry/service/add")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_service_already_exist");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed add service because joi validation with status 400", (done) => {
    const data = {
      name: "Baju",
      isUnit: false,
    };
    request(app)
      .post("/api/laundry/service/add")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe('"price" is required');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Edit Service", () => {
  test("Success edit service with status 200", (done) => {
    const data = {
      name: "Baju",
      price: 31231,
      isUnit: false,
    };
    request(app)
      .put("/api/laundry/service/edit/1")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_service_updated");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed edit service  because id not exist with status 404", (done) => {
    const data = {
      name: "Baju",
      price: 31231,
      isUnit: false,
    };
    request(app)
      .put("/api/laundry/service/edit/99999")
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
  test("Failed edit service because joi validation with status 400", (done) => {
    const data = {
      name: "Baju",
      isUnit: false,
      error: false,
    };
    request(app)
      .put("/api/laundry/service/edit/1")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe('"error" is not allowed');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get Service by id", () => {
  test("Success get order with status 200", (done) => {
    request(app)
      .get("/api/laundry/service/1")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed get order cause not own with status 401", (done) => {
    request(app)
      .get("/api/laundry/service/2")
      .set("authorization", `Bearer ${laundryToken}`)
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

describe("Delete Service", () => {
  test("Success delete with status 200", (done) => {
    request(app)
      .delete("/api/laundry/service/delete/1")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_service_deleted");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get Orders", () => {
  test("Success get order with status 200", (done) => {
    request(app)
      .get("/api/laundry/orders")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("totalPage");
        expect(body).toHaveProperty("totalRows");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Change Status", () => {
  test("Success change status with status 200", (done) => {
    const data = {
      orderId: "Order-1702535973296",
      newStatus: "app_payment",
    };
    request(app)
      .patch("/api/laundry/order/changeStatus")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_status_updated");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed change status because invalid status with status 400", (done) => {
    const data = {
      orderId: "Order-1702535973296",
      newStatus: "status_coy",
    };
    request(app)
      .patch("/api/laundry/order/changeStatus")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_status_invalid");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed change status because order id not found with status 404", (done) => {
    const data = {
      orderId: "Order",
      newStatus: "app_payment",
    };
    request(app)
      .patch("/api/laundry/order/changeStatus")
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

describe("Get Merchant", () => {
  test("Success get merchant with status 200", (done) => {
    request(app)
      .get("/api/laundry/my")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Edit Merchant", () => {
  test("Success edit merchant with status 200", (done) => {
    const data = {
      name: "baru",
    };
    request(app)
      .put("/api/laundry/edit")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_updated_merchant");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed edit merchant with status 400", (done) => {
    const data = {
      name: "baru",
      error: false,
    };
    request(app)
      .put("/api/laundry/edit")
      .set("authorization", `Bearer ${laundryToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe('"error" is not allowed');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Change Photo", () => {
  test("Success edit merchant with status 200", (done) => {
    request(app)
      .patch("/api/laundry/changePhoto")
      .set("authorization", `Bearer ${laundryToken}`)
      .field("Content-Type", "multipart/form-data")
      .attach("image", `${__dirname}/shortLogo.png`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toBe("app_updated_merchant_photo");
        done();
      })
      .catch((err) => done(err));
  });

  test("Failed edit photo merchant no image with status 404", (done) => {
    request(app)
      .patch("/api/laundry/changePhoto")
      .set("authorization", `Bearer ${laundryToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_404");
        done();
      })
      .catch((err) => done(err));
  });
});
