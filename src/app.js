const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const Routes = require("./routes/index");

app.use('/api/v1', Routes);
app.get("/", (req, res) => {
  res.send("API Running");
});

module.exports = app;