const express= require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require("express-session");

app.use('/static', express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'rest-one-secret',
}));

if (app.get('env') === 'development') {
    require('./database').init('dev');
} else {
    console.log('Configure app.js for non-development environment');
}

const Passport = require('./passport');
Passport.init();
const passport = Passport.passport;
app.use(passport.initialize());
app.use(passport.session({

}));

app.use('', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/api/user', require('./routes/api'));

const port = 3000;
app.listen(port, function () {
    console.log('Starting server at port ' + port + '...');
});
