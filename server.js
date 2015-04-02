var hapi = require('hapi');
var path = require('path');
var fs = require('fs');

var content;

fs.readFile('./content.json', function (err, data) {
    if(err) {
        console.log('Error reading content', err);
        return;
    }

    content = JSON.parse(data);
});

var server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    }
});

// server.connection({
//     host: 'americanaxe.com',
//     port: 80
// });

server.connection({
    // host: 'americanaxe.com',
    port: 8080
});

server.route({
    method: 'GET',
    path: '/file/{filename*}',
    handler: {
        file: function (req) {
            return req.params.filename;
        }
    }
});

server.route({
    method: 'GET',
    path: '/tmpl/{tmplname*}',
    handler: {
        file: function (req) {
            console.log('tmpl', req.params.tmplname);
            return 'tmpls/' + (req.params.tmplname.indexOf('.html') < 0 ? req.params.tmplname + '.html' : req.params.tmplname);
        }
    }
});

server.route({
    method: 'GET',
    path: '/content',
    handler: function (req, reply) {
        reply(content);
    }
});

server.route({
    method: 'GET',
    path: '/two',
    handler: function (req, reply) {
        reply.file('index2.html');
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
        reply.file('index.html');
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});
