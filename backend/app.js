import express from "express";
import cookieParser from "cookie-parser";

const app = express();



app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(express.static("public"));

app.use(cookieParser());


import UserRouter from "./Src/Routes/User.router.js"
app.use("/api/v1/users",UserRouter)

export {app};

