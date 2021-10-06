import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorHandlers/errorHandlers.js";

import blogPostRouter from "./services/blogPost/index.js";
// import commentRouter from "./services/blogPost/comments.js";

const server = express();

const { PORT = 5000 } = process.env;
server.use(cors());
server.use(express.json());
server.use("/blog", blogPostRouter);

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

// mongoose.connect(process.env.MONGODB);

// mongoose.connection.on("connected", () => {
//   server.listen(PORT, async () => {
//     console.log("Server is listening on port " + PORT);
//   });
// });

server.listen(PORT, async () => {
  // connect to mongoose Server
  mongoose.connect(process.env.MONGODB, {});
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log("Server is stoppped ", error);
});
