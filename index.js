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
app.post('/subscription', (req, res) => {
console.log(keySecret);
  try {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      },
      function (err, customer) {
        if (err) {
          res.status(400).send('Couldnt create the customer record');
        }

        stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              plan: 2,
            },
          ]
        }, function(err, subscription) {
            console.log(subscription);
            console.log(err);
          }
        );

        res.send(
          JSON.stringify({
            message: customer.id
          })
        );
      }
    );
  } catch (e) {
    res.status(400).send('Invalid JSON string');
  }
});


/**
 * @param  {} '/donate'
 * @param  {} (req
 * @param  {} res
 */
app.post('/create/user', (req, res) => {
  stripe.customers.create({
      email: req.body.stripeEmail
    },
    function (err, customer) {
      if (err) {
        res.send(
          JSON.stringify({
            message: 'Couldnt create user'
          })
        )

      }
      res.send(
        JSON.stringify({
          message: customer.id
        })
      );
    }
  );
});





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