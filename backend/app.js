import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  };
  app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(express.static("public"));

app.use(cookieParser());


import UserRouter from "./Src/Routes/User.router.js"
app.use("/api/v1/users",UserRouter)

import emergencyRouter from './Src/Routes/sos.router.js';

app.use("/api/v1/users", emergencyRouter);
export {app};

