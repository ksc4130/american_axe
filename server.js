var hapi = require('hapi');
var path = require('path');
var fs = require('fs');
var stripe = require("stripe")("sk_test_lWxJRcgmX8dy42podWM1Atfl");

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/american_axe');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback () {
    console.log('american_axe db opened');
});



var subscriberModel = require('./server/models/subscriber').model;

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
    method: 'POST',
    path: '/subscribe',
    handler: function (req, reply) {
        req.payload.subscriptionDate = new Date();
        subscriberModel.find({email: req.payload.email}).exec(function (err, docs) {
            if(!docs.length) {
                subscriberModel.create(req.payload).exec(function (err) {
                    if(!err) {
                        reply({success: true});
                        console.log('add subscription for', req.payload);
                    }
                });
            } else {
                console.log('subscription already exists for', req.payload);
                reply({success: false});
            }
        });

    }
});

server.route({
    method: 'GET',
    path: '/subscriptions',
    handler: function (req, reply) {
        subscriberModel.find({}).exec(function (err, docs) {
            reply(docs);
        });
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
    path: '/toh',
    handler: function (req, reply) {
        reply.file('toh.html');
    }
});

server.route({
    method: 'GET',
    path: '/ex',
    handler: function (req, reply) {
        reply.file('exchange.html');
    }
});

server.route({
    method: 'GET',
    path: '/stripe',
    handler: function (req, reply) {
        reply.file('testStripe.html');
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


/*strip test
 server.route({
 method: 'POST',
 path: '/testCharge',
 handler: function (req, reply) {
 console.log('req payload', req.payload);
 var charge = stripe.charges.create({
 amount: req.payload.amount * 100, // amount in cents, again
 currency: "usd",
 source: req.payload.token.id,
 description: "Test charge"
 }, function(err, charge) {
 if(err) {
 reply({
 succes: false,
 err: err
 });
 }
 if (err && err.type === 'StripeCardError') {
 // The card has been declined
 console.log('card was declined', err);
 } else if(err) {
 console.log('something happened', err);
 } else {
 console.log('good charge', charge);
 reply({
 success: true,
 charge: charge
 })
 }
 });
 }
 });
 */
