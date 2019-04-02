const express= require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');


const Database = require('./database');
if (app.get('env') === 'development') {
    Database.initPool('dev');
} else {
    console.log('Configure app.js for non-development environment');
}


app.use('/static', express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());

app.use('', require('./routes/index'));
app.use('/api/user', require('./routes/api'));

const port = 3000;
app.listen(port, function () {
    console.log('Starting server at port ' + port + '...');
});
