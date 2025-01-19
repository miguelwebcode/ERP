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
  res.json("Desde GET");
});

server.post("/", (req, res) => {
  res.json("Desde POST");
});

server.put("/", (req, res) => {
  res.json("Desde PUT");
});

server.patch("/", (req, res) => {
  res.json("Desde Patch");
});

server.delete("/", (req, res) => {
  res.json("Desde Delete");
});

export default server;
