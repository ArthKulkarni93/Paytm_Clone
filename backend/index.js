const express = require('express');
const { Router } = require('./routes');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
require('./db')
app.use('/api/v1',Router);
app.listen(3000,console.log('running on 3000'));