const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const {readdirSync} = require("fs");

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
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error", err));

app.get("/", (req, res) => {
  res.send("welcome from home");
});
app.get("/books", (req, res) => {
  res.send("hahahahahahahhahahaaiidhiagduogauodhguagdigaiduygiuagduagdiu");
});
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
