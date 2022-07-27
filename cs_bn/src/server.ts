import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import { connectStream } from "./stream-funs";
require('dotenv').config();

const app = express();
const corsOptions: CorsOptions = {
  origin: process.env["ORIGIN"],
  exposedHeaders: "Content-Disposition", //? https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json()); //? Json parser
app.use(express.urlencoded({ extended: true })); //? Parses bodies
app.use(helmet());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CryptoStream" });
});

// ? Default error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    message: err.message,
  });
});

//checks if there is an environment variable set, if not set to port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

connectStream(); // establish stream connection
