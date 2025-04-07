import { app } from "./app.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "./.env" });

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port :${process.env.PORT}`);
});