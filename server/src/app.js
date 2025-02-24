
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const { sequelize } = require('./models');
const path = require('path');


const app = express();

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cors());
//all routes are moved to route.js file
require('./routes')(app);
//connect to database
require('./db/dbConfig')
//The express.static middleware serves the uploaded files so that they can be accessed via URLs (e.g., http://localhost:3000/images/myfile.jpg).
app.use('/images', express.static(path.join(__dirname, '../images')));

//create the data base and start the server
sequelize.sync().then(
    ()=> {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server started on http://localhost:${config.port}`);
        });
    }
).catch(console.error);