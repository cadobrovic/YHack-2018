'use strict';

const CLIENT_ID = 'c874f684-eefd-47e9-9f10-e203ef725a6d';
const CLIENT_SECRET = 'd080b2ed-c097-478f-a66c-2f5aad11fbe6';

//import SDK
const smartcar = require('smartcar');
const express = require('express');
const bodyParser = require('body-parser')

// 1. Create an instance of Smartcar's client.
const client = new smartcar.AuthClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'http://localhost:8000/callback',
  scope: ['read_vehicle_info', 'read_location', 'read_odometer',
  'control_security', 'control_security:unlock', 'control_security:lock' ],
  testMode: true
});

// 2. Create a new webserver with the Express framework.
const app = express();

// 3. Create a page with a 'Connect Car' button.
app.get('/', function(req, res, next) {
  const authUrl = client.getAuthUrl({forcePrompt: true}); //always ask for permisssions
  res.send(`
    <h1>Connecting Your Car</h1>
    <a href=${authUrl}>
      <button>Connect Car</button>
    </a>
  `);
  console.log('Listening on 8000...');
});

// 4. On an HTTP GET to our callback will exchange our OAuth Auth Code
//    for an Access Token and log it out.
app.get('/callback', function(req, res, next) {
  //handling the access token
  let access;
  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  return client.exchangeCode(req.query.code)
    .then((_access) => {
    // in a production app you'll want to store this in some kind of persistent storage
    access = _access;
    // get the user's vehicles
    return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(result) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(result.vehicles[0], access.accessToken);
      
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(vehicleInfo) {
      console.log('Vehicle Info:', vehicleInfo);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }
      res.send(`
        <h1>Vehicle Info Obtained!<h1>
      `);
    });
});

// 5. Let's start up the server at port 8000.
app.listen(8000);
console.log('Listening on 8000...');

