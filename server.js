const express= require('express');
const app = express();

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8081, function () {
    console.log('Starting server at port 8081...');
});
