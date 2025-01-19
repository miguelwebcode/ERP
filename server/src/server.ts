import express from "express";
import cors from "cors";

const server = express();

server.use(cors({ origin: "http://localhost:5173" }));

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
