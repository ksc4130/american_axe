// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_lWxJRcgmX8dy42podWM1Atfl");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
//pk_test_2Au2loW9lRDjWnYmrDVgsvDA
//var stripeToken = 'pk_test_2Au2loW9lRDjWnYmrDVgsvDA';//request.body.stripeToken;

stripe.tokens.create({
  card: {
    "number": '4242424242424242',
    "exp_month": 12,
    "exp_year": 2016,
    "cvc": '123'
  }
}, function(err, token) {
  // asynchronously called
  if(err) {
    console.log('token creation failed', err);
    return;
  }
  //console.log('token', token);
  var charge = stripe.charges.create({
    amount: 50, // amount in cents, again
    currency: "usd",
    source: token.id,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      console.log('card was declined', err);
    } else if(err) {
      console.log('something happened', err);
    } else {
      console.log('good charge', charge);
    }
  });
});
