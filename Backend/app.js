const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./Database/Db');  

app.use(cors());
app.use(express.json());
app.use(cookieParser())

connectDB();

const UserRoute = require('./Route/UserRoute');

app.get('/', (req, res) => {
    res.send("Hello");
});

app.use('/users', UserRoute);   // FIXED

module.exports = app;
