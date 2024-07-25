import express from "express";
import "dotenv/config";
import "./database/db_connection";

import registationRouter from "./services/registration/routers/registrationRouter";
import todoRouter from "./services/todo/routers/todoRouter";

const app = express();
app.use(express.json());
console.log(process.env.PORT, "port");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`hello world`);
});

app.use("/api", registationRouter);
app.use("/hel", todoRouter);

app.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
