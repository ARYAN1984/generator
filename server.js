var express = require('express');

var path = require('path');

var app = express();

var PRIVATE_IP = process.env.PRIVATE_IP;

var port = 50452;

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {

  res.status(200).sendFile(path.join(__dirname, 'index.html'));

});


//
// DigitalOcean Droplets require private IP
// https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7
//
app.set( 'host', `${PRIVATE_IP}` );

app.listen(port, () => {

  console.info('Running on port ' + port);

});

// Routes
app.use('/api/discord', require('./api/discord'));

app.use((err, req, res, next) => {

  switch (err.message) {

    case 'NoCodeProvided':

      console.error(err.stack);

      return res.status(400).send({

        status: 'ERROR',

        error: err.message,

      });

    default:

      return res.status(500).send({

        status: 'ERROR',

        error: err.message,

      });

  }

});