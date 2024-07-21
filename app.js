const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./app/api/auth/router');
const dashboardRouter = require('./app/api/dashboard/router');

const app = express();
const apiVersion = '/api/v1';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${apiVersion}/auth`, authRouter);
app.use(`${apiVersion}/dashboard`, dashboardRouter);

module.exports = app;
