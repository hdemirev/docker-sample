"use strict";

const express = require("express");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  console.log("handling request, k revision: ", process.env.K_REVISION);
  res.send("Hello World, PR test, k revision: " + process.env.K_REVISION);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
