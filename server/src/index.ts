import server from "./server";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`REST API from PORT ${PORT}`);
});
