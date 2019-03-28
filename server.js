const express= require('express');
const app = express();

const logger = require('morgan');

app.use('/static', express.static('static'));
app.use(logger('dev'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8081, function () {
    console.log('Starting server at port 8081...');
});
