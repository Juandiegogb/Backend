import express from "express";
import morgan from "morgan";

const app = express();



app.use(express.json());
app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Server ready");
});

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

let db = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(db);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = db.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`The phonebook has ${db.length} registers at ${date}`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personToDelete = db.find((person) => person.id === id);
  if (personToDelete) {
    db = db.filter((person) => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  if (req.body.name && req.body.number) {
    const newName = req.body.name.toLowerCase();
    const nameExist = db.some((person) =>
      person.name.toLowerCase().includes(newName)
    );
    if (nameExist) {
      return res.status(400).json({ message: "Name alredy in db" });
    }
    req.body.id = Math.max(...db.map((person) => person.id)) + 1;
    db.push(req.body);
    res.status(200).end();
  } else {
    res.status(400).end();
  }
});

app.put("/test", (req, res) => {
  console.log(req.body);
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };
// app.use(unknownEndpoint);
