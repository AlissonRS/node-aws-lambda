'use strict'

const mongoose = require('mongoose');
const requireDir = require('require-dir');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const express = require('express')
const app = express()
app.use(express.json());
app.use(awsServerlessExpressMiddleware.eventContext())

// configure database
const connString = process.env['MONGODB_ATLAS_CLUSTER_URI'];
mongoose.connect(connString, { useNewUrlParser: true, ssl: true });

requireDir('./src/models');

app.use("/api", require("./src/routes"));

module.exports = app