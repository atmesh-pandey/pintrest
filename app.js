const express = require('express');
const path = require('path');
const connectToDatabase = require("./services/mongoDB.service")
const indexRouter = require('./routes/index');
const usersRouter = require('./model/users');
require("dotenv").config();

const app = express();
connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

module.exports = app;
