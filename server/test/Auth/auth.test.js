const request = require("supertest");
const CryptoJS = require("crypto-js");
const Redis = require("ioredis-mock");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = require("../../index");
const { sequelize } = require("../../models/index");
const { hashPassword } = require("../../utils/bcryptUtil");
const {
  verifyTokenVerifyEmail,
  createTokenForForgetPassword,
  createRefreshToken,
} = require("../../utils/jwtUtil");
const jwt = require("jsonwebtoken");
const { queryInterface } = sequelize;

const mockRedisClient = new Redis();
const mockSendMail = jest.fn();

jest.mock("ioredis", () => require("ioredis-mock"));
jest.mock("nodemailer");
jest.mock("../../utils/streamChatUtil", () => {
  const chatStreamClient = {
    upsertUser: jest.fn(),
  };
  return { chatStreamClient };
});
jest.mock("../../utils/googleLoginUtil", () => {
  const oauth2Client = {
    generateAuthUrl: jest.fn(),
    getToken: () => {
      return { tokens: "token" };
    },
    setCredentials: jest.fn(),
  };
  return { oauth2Client };
});
jest.mock("googleapis", () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn(),
      },
      oauth2: jest.fn(() => {
        return {
          userinfo: {
            get: jest.fn(() => {
              return {
                data: {
                  name: "test",
                  email: "ahmad12alif@gmail.com",
                  picture: "./image.png",
                },
              };
            }),
          },
        };
      }),
    },
  };
});

nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

let emailToken;
let userToken;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      id: 99,
      fullName: "Ahmad Alif Sofian",
      email: "alif12sofian@gmail.com",
      phone: "",
      role: "admin",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: "user",
      email: "user10@user.com",
      role: "user",
      imagePath: null,
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 109,
      fullName: "laundry 2",
      email: "laundry2@user.com",
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
      userId: 109,
      description: "ini adalah description",
      imagePath: null,
      location: `{"lat":-6.223710368739434,"lng":106.84333920478822}`,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {});
});

describe("Login User", () => {
  beforeEach((done) => {
    mockRedisClient.flushall();
    done();
  });

  test("Success login user with status 200", (done) => {
    const dataUserLogin = {
      email: "alif12sofian@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .post("/api/auth/login")
      .send(dataUserLogin)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("imagePath");
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_login_success");
        userToken = body.token;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Invalid password and email Login user with status 400", (done) => {
    const dataUserLogin = {
      email: "dumm@mail.com",
      password: CryptoJS.AES.encrypt(
        "password12",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .post("/api/auth/login")
      .send(dataUserLogin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.message).toBe("app_login_invalid");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Login unverified user with status 400", (done) => {
    const dataUserLogin = {
      email: "laundry2@user.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .post("/api/auth/login")
      .send(dataUserLogin)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.message).toBe("app_login_not_verify");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Should increment login attempt with status 400", (done) => {
    const dataUserLogin = {
      email: "user10@user.com",
      password: CryptoJS.AES.encrypt(
        "password12",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .post("/api/auth/login")
      .send(dataUserLogin)
      .then(({ status, body }) => {
        mockRedisClient.get(
          `loginAttempts:${dataUserLogin.email}`,
          (err, attempts) => {
            expect(status).toBe(400);
            expect(body.message).toBe("app_login_invalid");
            expect(Number(attempts)).toBe(1);
            done();
          }
        );
      })
      .catch((err) => {
        done(err);
      });
  });

  test("hit login max attempt with status 400", (done) => {
    const dataUserLogin = {
      email: "user10@user.com",
      password: CryptoJS.AES.encrypt(
        "password12",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    mockRedisClient.set(`loginAttempts:${dataUserLogin.email}`, 3, () => {
      request(app)
        .post("/api/auth/login")
        .send(dataUserLogin)
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.message).toBe("app_login_max_attemps");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  test("joi validation failed with status 400", (done) => {
    const dataUserLogin = {
      password: CryptoJS.AES.encrypt(
        "password12",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .post("/api/auth/login")
      .send(dataUserLogin)
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body.message).toBe('"email" is required');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get link Redirect google", () => {
  test("Success get location url with status 200", (done) => {
    request(app)
      .get("/api/auth/google")
      .then(({ status }) => {
        expect(status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get data login google", () => {
  test("Success login and created new user with status 200", (done) => {
    const code = "code";
    request(app)
      .post("/api/auth/google/data")
      .send({ code })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("created");
        expect(body.message).toBe("app_login_success");
        expect(body.created).toBe("app_user_created_check_email");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed Login cause no code with status 400", (done) => {
    request(app)
      .post("/api/auth/google/data")
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_login_failed");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Logout User", () => {
  test("Success logout user with status 200", (done) => {
    request(app)
      .post("/api/auth/logout")
      .send({ id: 1 })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_logout_success");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Refresh Token", () => {
  const payload = {
    id: 99,
    role: "admin",
    fullName: "ahmad",
  };
  const refreshToken = createRefreshToken(payload);
  const expiredRefreshToken = jwt.sign(
    payload,
    process.env.SECRET_KEY_REFRESH,
    {
      expiresIn: "1s",
    }
  );
  test("Success get refresh status 200", (done) => {
    request(app)
      .get("/api/auth/refresh")
      .set("Cookie", `refreshToken=${refreshToken}`)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("token");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("failed get new access token cause no cookie token status 401", (done) => {
    request(app)
      .get("/api/auth/refresh")
      .then(({ body, status }) => {
        expect(status).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_session_expired");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("failed get new access token cause expire token status 400", (done) => {
    setTimeout(() => {
      request(app)
        .get("/api/auth/refresh")
        .set("Cookie", `refreshToken=${expiredRefreshToken}`)
        .then(({ body, status }) => {
          expect(status).toBe(401);
          expect(body).toHaveProperty("message");
          expect(body.message).toBe("app_session_expired");
          done();
        })
        .catch((err) => {
          done(err);
        });
    }, 1000);
  });
});

describe("Register User", () => {
  test("Success register user role user with status 200", (done) => {
    const dataUserRegister = {
      fullName: "dummy",
      email: "dummy@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      role: "user",
      phone: "313873197391",
    };
    request(app)
      .post("/api/auth/register")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toBe("app_register_success");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Success register merchant role user with status 200", (done) => {
    const dataUserRegister = {
      fullName: "dummy",
      email: "dummy2@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      role: "merchant",
      phone: "313873197391",
      merchant: {
        name: "laundry",
        description: "mantap kali",
      },
    };
    request(app)
      .post("/api/auth/register")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toBe("app_register_success_laundry");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Failed register cause name merchant undefined undefined with status 400", (done) => {
    const dataUserRegister = {
      fullName: "dummy",
      email: "dummyy2@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      role: "merchant",
      phone: "313873197391",
      merchant: {
        description: "mantap kali",
      },
    };
    request(app)
      .post("/api/auth/register")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe('"name" is required');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("User with that email already exist with status 400", (done) => {
    const dataUserRegister = {
      fullName: "dummy",
      email: "dummy@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      role: "user",
      phone: "313873197391",
    };
    request(app)
      .post("/api/auth/register")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_register_already_exist");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("Failed register cause fullname undefined with status 400", (done) => {
    const dataUserRegister = {
      email: "dummy3@gmail.com",
      password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      role: "user",
      phone: "313873197391",
    };
    request(app)
      .post("/api/auth/register")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe('"fullName" is required');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Verify Email", () => {
  test("success send email otp to email with status 200", (done) => {
    const dataUserRegister = {
      email: "ahmad12ali@gmail.com",
    };
    request(app)
      .post("/api/auth/verifyEmail")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("token");
        expect(body.data).toHaveProperty("expire");
        expect(body.message).toBe("app_verify_email_otp_send");
        emailToken = body.data.token;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("user already exist with email with status 400", (done) => {
    const dataUserRegister = {
      email: "user10@user.com",
    };
    request(app)
      .post("/api/auth/verifyEmail")
      .send(dataUserRegister)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_register_already_exist");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Check OTP Verify Email", () => {
  test("Succes verify OTP email with status 200", (done) => {
    const { otp } = verifyTokenVerifyEmail(emailToken);
    request(app)
      .post("/api/auth/checkOtpVerifyEmail")
      .send({ otp, token: emailToken })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_verify");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Invalid OTP with status 400", (done) => {
    const otp = 1234;
    request(app)
      .post("/api/auth/checkOtpVerifyEmail")
      .send({ otp, token: emailToken })
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_verify_email_otp_invalid");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Forgot Password", () => {
  test("Success send email for forgot password with status 200", (done) => {
    const email = "alif12sofian@gmail.com";
    request(app)
      .post("/api/auth/forgotPassword")
      .send({ email })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_forgot_password_email_sent");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("User with email notfound with status 404", (done) => {
    const email = "usersda@userdsa.com";
    request(app)
      .post("/api/auth/forgotPassword")
      .send({ email })
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

describe("Set reset Password", () => {
  test("Success set reset pasword with status 200", (done) => {
    const tokenResetPassword = createTokenForForgetPassword("user10@user.com");
    const new_password = CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString();
    request(app)
      .put("/api/auth/resetPassword")
      .send({ new_password, token: tokenResetPassword })
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("app_reset_password_success");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("Forbidden cause token reset email false with status 403", (done) => {
    const new_password = CryptoJS.AES.encrypt(
      "password123",
      process.env.CRYPTOJS_SECRET
    ).toString();
    request(app)
      .put("/api/auth/resetPassword")
      .send({ new_password })
      .then(({ status }) => {
        expect(status).toBe(403);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("get Profile", () => {
  test("Success get profile with status 200", (done) => {
    mockRedisClient.set("99", userToken);
    request(app)
      .get("/api/auth/profile")
      .set("authorization", `Bearer ${userToken}`)
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toEqual("success");
        expect(body.data).toHaveProperty("id");
        expect(body.data).toHaveProperty("imagePath");
        done();
      })
      .catch((err) => done(err));
  });
  test("Forbidden get profile with status 403", (done) => {
    request(app)
      .get("/api/auth/profile")
      .then(({ status }) => {
        expect(status).toBe(403);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Edit Profile", () => {
  mockRedisClient.set("1", userToken);
  test("Success Edit profile with status 200", (done) => {
    const newUser = {
      fullName: "alif",
      phone: "472343824",
    };
    request(app)
      .put("/api/auth/edit/profile")
      .set("authorization", `Bearer ${userToken}`)
      .send(newUser)
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.message).toEqual("app_edit_profile_success");
        expect(body.data).toHaveProperty("id");
        expect(body.data).toHaveProperty("imagePath");
        done();
      })
      .catch((err) => done(err));
  });
  test("Failed Edit profile old pass not same with status 400", (done) => {
    const newUser = {
      fullName: "alif",
      phone: "472343824",
      old_password: CryptoJS.AES.encrypt(
        "password122131",
        process.env.CRYPTOJS_SECRET
      ).toString(),
      new_password: CryptoJS.AES.encrypt(
        "password123",
        process.env.CRYPTOJS_SECRET
      ).toString(),
    };
    request(app)
      .put("/api/auth/edit/profile")
      .set("authorization", `Bearer ${userToken}`)
      .send(newUser)
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual("app_edit_profile_pass_invalid");
        done();
      })
      .catch((err) => done(err));
  });
  test("Forbidden edit profile with status 403", (done) => {
    request(app)
      .put("/api/auth/edit/profile")
      .then(({ status }) => {
        expect(status).toBe(403);
        done();
      })
      .catch((err) => done(err));
  });
  test("Failed Edit profile joi with status 400", (done) => {
    const newUser = {
      fullName: "alif",
      phone: "472343824",
      error: false,
    };
    request(app)
      .put("/api/auth/edit/profile")
      .set("authorization", `Bearer ${userToken}`)
      .send(newUser)
      .then(({ status, body }) => {
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual('"error" is not allowed');
        done();
      })
      .catch((err) => done(err));
  });
});
