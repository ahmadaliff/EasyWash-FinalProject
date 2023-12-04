require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const routes = require("./routers/index");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
