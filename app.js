const express= require('express');
const app = express();

const logger = require('morgan');
const bodyParser = require('body-parser');

app.use('/static', express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());

app.use('', require('./routes/index'));
app.use('/api/user', require('./routes/api'));

app.listen(8081, function () {
    console.log('Starting server at port 8081...');
});
