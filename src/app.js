const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const contractRoutes = require('./routes/contracts');
const jobsRoutes = require('./routes/jobs');
const balanceRoutes = require('./routes/balance');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(contractRoutes);
app.use(jobsRoutes);
app.use(balanceRoutes);

module.exports = app;
