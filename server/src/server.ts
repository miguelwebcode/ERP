import express from "express";
import cors from "cors";

const server = express();

const corsOptions = {
  origin: "http://localhost:5173", // Permitir solicitudes solo desde esta URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};

server.use(cors(corsOptions));

// Routing

server.get("/", (req, res) => {
  res.json("Desde GET Root");
});

server.get("/customers", (req, res) => {
  res.json("Desde GET customers");
});

server.get("/projects", (req, res) => {
  res.json("Desde GET projects");
});

server.get("/users", (req, res) => {
  res.json("Desde GET users");
});

server.post("/", (req, res) => {
  res.json("Desde POST root");
});

server.post("/customers", (req, res) => {
  const customer = req.body;
  res.json({ message: "Customer created", customer });
});

server.post("/projects", (req, res) => {
  const project = req.body;
  res.json({ message: "Project created", project: project });
});

server.post("/users", (req, res) => {
  console.log(req);
  const user = req.body;
  console.log(user);
  res.json({ message: "User created", user });
});

server.put("/", (req, res) => {
  res.json("Desde PUT root");
});

server.patch("/", (req, res) => {
  res.json("Desde Patch root");
});

server.delete("/", (req, res) => {
  res.json("Desde Delete root");
});

export default server;
