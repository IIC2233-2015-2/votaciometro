'use strict';

// Imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const basicAuth = require('./auth');
const Table = require('./table');

// Webapp
const app = express();

// Logs
app.use(morgan('dev'));

// Database connection
mongoose.connect('mongodb://mongo:27017/napoleon', err => {
  if (err) { mongoose.connect('mongodb://localhost:27017/napoleon'); }
});

// Prepare database
const MAX_VOTES = 1000;
const listas = ['Solidaridad', 'Nau!', '1A', 'Crecer'];
const lugares = ['San Joaquín', 'Casa Central', 'Lo Contador', 'Campus Oriente', 'Villarica'];

// Clean old records
Table.remove().exec();

// Seed new ones
lugares.forEach(lugar => {
  Table.create({
    name:   lugar,
    votes:  listas.reduce((result, lista) => {
              result[lista] = Math.floor(Math.random() * MAX_VOTES);
              return result;
            }, {}),
    });
});

// Auth
const USER = process.env.USER
const PASS = process.env.PASS
const auth = basicAuth(USER, PASS)

// Serve static content from 'public' directory
app.use(express.static('public'));

app.get('/api/v1/lists', auth, (req, res) => {
  res.send(listas);
});

app.get('/api/v1/tables', auth, (req, res) => {
  Table.find({}, 'name').then(tables => {
    res.send(tables);
  });
});

app.get('/api/v1/tables/:id', auth, (req, res) => {
  Table.findOne({_id: req.params.id}, 'name votes').then(tables => {
    res.send(tables);
  });
});

// Start
const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
