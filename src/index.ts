import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {readdirSync} from "fs";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

const options = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json());

// routes
readdirSync(path.join(__dirname, 'routes')).map((r) => {
    const route = require(path.join(__dirname, 'routes', r));

    app.use(route.default || route); // In case you're using ES6 modules
});

// database
mongoose
  .connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  } as any)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error", err));

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
