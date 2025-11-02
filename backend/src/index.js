const express = require('express');
const app = express();
const port = 3000;

const { connectDB } = require('./config/connectDB')
const sync = require('./models/sync')

const route = require('./routes/index.routes')


connectDB();
sync();
route(app);

app.get('/', (req, res) => res.send("Hellooooo "))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))