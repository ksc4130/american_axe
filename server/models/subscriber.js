var mongoose = require('mongoose');

var subscriberSchema = mongoose.Schema({
    email: {type: String, unique: true, required: '{PATH} is required'},
    subscriptionDate: {type: Date, required: '{PATH} is required'}
});

var Subscriber = mongoose.model('Subscriber', subscriberSchema);

exports.model = mongoose.model('Subscriber');