var express = require('express'),
    path = require('path');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = {
    port: 3030,
    rootPath: __dirname
};

var app = express();

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/fonts', express.static('public/fonts'));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/server/views/index.html');
});

app.listen(config.port);
console.log('listening on port', config.port);