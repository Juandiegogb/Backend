import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./db.js";
import contactModel from "./src/models/contactModel.js";
dotenv.config({ path: "./src/.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./dist"));
dbConnect();

morgan.token("body", function (req, res) {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

app.get("/api/persons", (req, res, next) => {
  contactModel
    .find()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/info", (req, res, next) => {
  contactModel.countDocuments().then((result) => {
    const fecha = new Date();
    res.json(
      `Tenemos ${result} registros en la base de datos a fecha y hora de ${fecha.toString()}`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  contactModel
    .findById(id)
    .then((result) => {
      result
        ? res.json(result)
        : res.status(400).send({ message: "invalid id" });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  contactModel
    .findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (req.body.name && req.body.number) {
    contactModel
      .create({ name: req.body.name, number: req.body.number })
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => next(error));
  } else {
    res.status(404).end();
  }
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  contactModel
    .findByIdAndUpdate(id, req.body)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorsHandler = (error, req, res, next) => {
  console.error(error.name);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  } else {
    return res.status(500).send({ error: "something went wrong" });
  }
};

app.use(errorsHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
