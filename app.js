import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join } from 'path';

import contactsRouter from "./routes/contactsRouter.js";

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const app = express();

const DB_HOST = "mongodb+srv://commonUser:Grastias2015@testcluster.j1hwufc.mongodb.net/contacts";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });


app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running. Use our API on port: ${process.env.PORT}`);
// });
