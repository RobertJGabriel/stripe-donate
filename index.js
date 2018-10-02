const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;


const app = require('express')()
const stripe = require('stripe')(keySecret);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Default routing file
/**
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 */
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(
    JSON.stringify({
      message: 'Nothing to see here!! 😘'
    })
  )
})


/**
 * @param  {} '/donate'
 * @param  {} (req
 * @param  {} res
 */
app.post('/donate', (req, res) => {

  let amount = req.query.amount;

  if (typeof amount === 'undefined' || amount === null) {
    amount = 100; // 1 dollar as the default.
  }

  try {
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer =>
        stripe.charges.create({
          amount,
          description: `${req.body.stripeEmail} donatee ${amount}`,
          currency: 'EUR',
          customer: customer.id
        })
      )
      .then(charge => res.redirect('https://robertgabriel.ninja/thankyou'));
  } catch (e) {
    res.status(400).send('Invalid JSON string')
  }
})


/**
 * @param  {} 'port'
 * @param  {} process.env.PORT||5000
 */
app.set('port', process.env.PORT || 5000);

// Spin up the server
/**
 * @param  {} app.get('port'
 * @param  {} function(
 */
app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'))
});