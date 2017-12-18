// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var users = require('./routes/user');
var index = require('./routes/index');
var mongojs = require('mongojs');
//From mLab, To connect using a driver via the standard MongoDB URI:
//var db = mongojs('mongodb://admin:greenlightrising@ds159866.mlab.com:59866/userdb001', ['UserInfo']);
var db = mongojs(process.env.DB, ['UserInfo']);
//JWT config
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');//added from authO tutorial
const jwtAuthz = require('express-jwt-authz');//added from authO tutorial

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {//added from authO tutorial
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}


// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
// const checkJwt = jwt({
//     // Dynamically provide a signing key
//     // based on the kid in the header and
//     // the singing keys provided by the JWKS endpoint.
//     secret: jwksRsa.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: 'https://juliettet.auth0.com/.well-known/jwks.json'
//       }),
//
//       // Validate the audience and the issuer.
//       audience: process.env.AUTH0_AUDIENCE,
//       issuer: 'https://juliettet.auth0.com/',
//       algorithms: ['RS256']
//   });

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:messages']);//added from auth0

var port = 3000;
var app = express();
app.use(cors());//added from authO tutorial
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '../client/UserManagement/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set("userdb",db);
app.use('/', index);
app.use("/api", checkJwt, users);

app.get('*', function(req, res) {//connect to Angular/client app
     res.render(path.join(__dirname, '../client/UserManagement/dist/index.html')); // load our public/index.html file
});

app.get('/api/private', checkJwt, checkScopes, function(req, res) {//added from auth0
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(port, function(){
    console.log('Server started on port '+port);
});
