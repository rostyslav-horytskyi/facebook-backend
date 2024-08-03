const express = require("express");
const cors = require("cors");
const {readdirSync} = require("fs");

const app = express();

const options = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(options));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

app.get("/", (req, res) => {
  res.send("welcome from home");
});
app.get("/books", (req, res) => {
  res.send("hahahahahahahhahahaaiidhiagduogauodhguagdigaiduygiuagduagdiu");
});
app.listen(8000, () => {
  console.log("server is lestining...");
});
