const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send({ message:'Server is running...'});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;