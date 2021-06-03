require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const connectDB = require('./services/db');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(cors());
app.use(express.static(path.join(__dirname, './app')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(routes);
app.listen(PORT, () => {
    console.log(`Bears... Beets... Battlestar Galactica on Port ${PORT}`);
});