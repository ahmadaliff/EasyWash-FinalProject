const request = require("supertest");
const CryptoJS = require("crypto-js");

require("dotenv").config();

const app = require("../../index");
const { sequelize } = require("../../models/index");
const { hashPassword } = require("../../utils/bcryptUtil");
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      id: 5,
      fullName: "user",
      email: "user@user.com",
      role: "user",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      fullName: "laundry",
      email: "laundry@user.com",
      role: "merchant",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("Merchants", [
    {
      id: 1,
      name: "Laundry 1",
      userId: 6,
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
      enable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Cuci Reguler Satuan Baju",
      merchantId: 1,
      price: 8000,
      isUnit: true,
      enable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("Orders", [
    {
      id: `Order-1702535973296`,
      userId: 5,
      totalPrice: 12000,
      status: "app_payment",
      location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
      midtransToken: "token",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {});
  await queryInterface.bulkDelete("Merchants", null, {});
  await queryInterface.bulkDelete("Services", null, {});
  await queryInterface.bulkDelete("Orders", null, {});
});

let laundryToken;
let userToken;
let cartId;
let orderId;

describe("Get All laundry in radius 3 km", () => {
  test("Success get all laundry with status 200", (done) => {
    const location = '{"lat": -6.224934545453234, "lng": 106.86266439802276 }';
    request(app)
      .post("/api/user/merchant")
      .send({ location })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed get all laundry cause no location in body with status 404", (done) => {
    request(app)
      .post("/api/user/merchant")
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

beforeAll(async () => {
  const dataLaundryLogin = {
    email: "laundry@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };
  const dataUserLogin = {
    email: "user@user.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString(),
  };

  const laundryLogin = await request(app)
    .post("/api/auth/login")
    .send(dataLaundryLogin);
  laundryToken = laundryLogin.body.token;

  const userLogin = await request(app)
    .post("/api/auth/login")
    .send(dataUserLogin);
  userToken = userLogin.body.token;
});

describe("Get laundry by id", () => {
  test("Success get laundry by id with status 200", (done) => {
    const location = '{"lat": -6.224934545453234, "lng": 106.86266439802276 }';
    request(app)
      .post("/api/user/detail/laundry/1")
      .set("authorization", `Bearer ${userToken}`)
      .send({ location })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed get laundry cause no location or params in body with status 404", (done) => {
    request(app)
      .post("/api/user/detail/laundry/")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ status }) => {
        expect(status).toBe(404);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed get laundry cause no merchant with that id with status 404", (done) => {
    request(app)
      .post("/api/user/detail/laundry/4")
      .set("authorization", `Bearer ${userToken}`)
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

  test("Failed get laundry cause distance more than 3 km with that id with status 400", (done) => {
    const location = '{"lat": -8, "lng": 106.86266439802276 }';
    request(app)
      .post("/api/user/detail/laundry/1")
      .set("authorization", `Bearer ${userToken}`)
      .send({ location })
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_laundry_out_of_range");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed get detail laundry cause user role not user with that id with status 400", (done) => {
    const location = '{"lat": -8, "lng": 106.86266439802276 }';
    request(app)
      .post("/api/user/detail/laundry/1")
      .set("authorization", `Bearer ${laundryToken}`)
      .send({ location })
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

describe("getFavorit", () => {
  test("Success get all favorit with status 200", (done) => {
    request(app)
      .get("/api/user/favorit")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Unauthorize access to get favorit with status 401", (done) => {
    request(app)
      .get("/api/user/favorit")
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

describe("add to favorit", () => {
  test("Success add to favorit with status 201", (done) => {
    request(app)
      .post("/api/user/favorit/add/1")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_add_to_fav");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed add to favorit cause already exist with status 400", (done) => {
    request(app)
      .post("/api/user/favorit/add/1")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_already_fav");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("delete from favorit", () => {
  test("Success delete from favorit with status 200", (done) => {
    request(app)
      .delete("/api/user/favorit/delete/1")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_delete_from_fav");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed delete from favorit not found with status 404", (done) => {
    request(app)
      .delete("/api/user/favorit/delete/1")
      .set("authorization", `Bearer ${userToken}`)
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

describe("get cart", () => {
  test("Success get cart with status 200", (done) => {
    request(app)
      .get("/api/user/cart")
      .set("authorization", `Bearer ${userToken}`)
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

describe("add to cart", () => {
  const data = {
    serviceId: 1,
    quantity: 2,
  };
  test("Success add to cart with status 201", (done) => {
    request(app)
      .post("/api/user/cart/add")
      .set("authorization", `Bearer ${userToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_add_to_cart");
        cartId = body.data.id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed add to cart cause already in cart with status 400", (done) => {
    request(app)
      .post("/api/user/cart/add")
      .set("authorization", `Bearer ${userToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_already_exist");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("update quantity cart", () => {
  test("Success update quantity with status 200", (done) => {
    const data = {
      serviceId: 1,
      quantity: 4,
    };
    request(app)
      .put("/api/user/cart/updateQuantity")
      .set("authorization", `Bearer ${userToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed update quantity cause service not found with status 404", (done) => {
    const data = {
      serviceId: 5,
      quantity: 4,
    };
    request(app)
      .put("/api/user/cart/updateQuantity")
      .set("authorization", `Bearer ${userToken}`)
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

describe("delete from cart", () => {
  test("Success delete from cart with status 200", (done) => {
    request(app)
      .delete(`/api/user/cart/delete/${cartId}`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_success_delete_from_cart");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed delete cause no cart with id not found with status 404", (done) => {
    request(app)
      .delete("/api/user/cart/delete/9999")
      .set("authorization", `Bearer ${userToken}`)
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

describe("Create order", () => {
  test("Success create order with status 201", (done) => {
    const data = {
      orderItems: [{ id: "1", serviceId: "1", quantity: "2" }],
      location: '{"lat": -6.224934545453234, "lng": 106.86266439802276 }',
    };
    request(app)
      .post(`/api/user/order/add`)
      .set("authorization", `Bearer ${userToken}`)
      .send(data)
      .then(({ body, status }) => {
        expect(status).toBe(201);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toBe("app_created_order");
        orderId = body.data.id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed create order cause location or orderitems notfound found with status 404", (done) => {
    request(app)
      .post(`/api/user/order/add`)
      .set("authorization", `Bearer ${userToken}`)
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

describe("Get all order", () => {
  test("Success get orders with status 200", (done) => {
    request(app)
      .get("/api/user/orders")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Get order by id", () => {
  test("Success get order by id with status 200", (done) => {
    request(app)
      .get(`/api/user/order/${orderId}`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("data");
        done();
      })
      .catch((err) => done(err));
  });
  test("Failed get order by id with status 404", (done) => {
    request(app)
      .get(`/api/user/order/2`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_404");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Cancel Order", () => {
  test("Success cancel order with status 200", (done) => {
    request(app)
      .delete(`/api/user/order/cancel/${orderId}`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_cancel_order_success");
        done();
      })
      .catch((err) => done(err));
  });
  test("Failed cancel order with status 404", (done) => {
    request(app)
      .delete(`/api/user/order/cancel/2`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_404");
        done();
      })
      .catch((err) => done(err));
  });

  test("Failed cancel order with status 400", (done) => {
    request(app)
      .delete(`/api/user/order/cancel/Order-1702535973296`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_cannot_cancel_order");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Create midtrans token", () => {
  test("Success midtrans token from db with status 200", (done) => {
    request(app)
      .get(`/api/user/midtransToken/Order-1702535973296`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("token");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Update order status after payment", () => {
  test("Success Update order status after payment with status 200", (done) => {
    request(app)
      .put(`/api/user/changeStatusPayment/Order-1702535973296`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_status_updated");
        done();
      })
      .catch((err) => done(err));
  });
  test("failed Update order status after payment cause old status not app_payment with status 400", (done) => {
    request(app)
      .put(`/api/user/changeStatusPayment/Order-1702535973296`)
      .set("authorization", `Bearer ${userToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_status_invalid");
        done();
      })
      .catch((err) => done(err));
  });
});
