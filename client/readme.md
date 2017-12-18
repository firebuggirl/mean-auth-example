## Create new app with routing in client directory:

` ng new UserManagement --routing `


` ng serve -o ` to start and open in browser

## create enum for database operation through command:
https://www.codeproject.com/Articles/1202241/MEAN-Stack-with-Angular-Auth-Auth-JWT-Authorizat

` ng g enum shared/dbop `

## create the service that would talk to Expressjs exposed APIs to manage the user (load all users, addd, update and delete user)

* ...from UserManagement directory..

` ng g service service/user --module app.module.ts `

*  When we will call Angular client from Expressjs server, this URL would be http://localhost:3000/api/users


## create 'dist' directory
* This is the folder we will refer in Expressjs as our target view container. This folder has index.html file that is our entry point to Angular application since it has <app-root></app-root> that is selector for AppComponent and in AppComponent, we have menu item Home and User Management (that target to corresponding view according to Routing) and <router-outlet></router-outlet> selectors where these views are rendering.



`  ng build `

## go back to server folder

* create the index route in Expressjs that would point to index.html discussed in previous steps

* Right click on server -> routes and select option New File. Enter file name index.js... telling Expressjs router that if there is no route defined .i.e. http://localhost:3000. Just go to client folder and render the index.html from dist folder

* edit the server -> app.js
- The first line of code we added is var index = require('./routes/index');, we are importing the index router.


## Create auth:

` npm install --save auth0-js `

` ng g service auth/auth --module app.module.ts `

## Create interface for AuthConfig:

` ng g interface auth/auth0-variables `

## Add Auth serice to app.component.ts in constructor

## Create Angular router guard (https://angular.io/guide/router#milestone-5-route-guards):

https://www.codeproject.com/Articles/1203649/MEAN-Stack-with-Angular-Auth-Auth-JWT-Authoriza

` ng g guard guard/auth --module app.module `

##  Create the login component + add link to Log In & Log Out button

` ng g component login `

` ng g component callback `



## Update app-routing.module.ts:

` import { AuthGuard } from "./guard/auth.guard";
  import { LoginComponent } from "./login/login.component";
  import { CallbackComponent } from "./callback/callback.component"; `

- add this to `user` path:
  `   canActivate: [AuthGuard] `

- add ` login `  and ` callback` paths:

`   {
      path: 'login',
      component: LoginComponent
    }, `

`   {
      path: 'callback',
      component: CallbackComponent
    } `
## Edit app.js in Server directory in handle unknown routes

## Test app:

- From UserManagement:

` ng build `

- From server directory:

` node app.js `

## Restrict our APIs to be accessed by trustable source w/ JWT:

` npm i angular2-jwt --save `

* Update app.module.ts:

`   import { AuthHttp, AuthConfig } from 'angular2-jwt';

    export function authHttpServiceFactory(http: Http, options: RequestOptions) {
      return new AuthHttp(new AuthConfig(), http, options);
    } `

    + add this to `providers`

    `  //angular2-jwt config
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    } `

## Update client -> UserManagement -> src -> app -> service -> user.service.ts:

` import { AuthHttp } from "angular2-jwt"; `

## Update Expressjs server APIs to read and verify JWT:

 https://auth0.com/docs/quickstart/backend/nodejs/01-authorization

 * Go back to `server` directory:
`  npm install -- save express-jwt jwks-rsa express-jwt-authz `

* update `server/app.js`:

` //JWT config
    const jwt = require('express-jwt');
    const jwksRsa = require('jwks-rsa');
    // Authentication middleware. When used, the
    // access token must exist and be verified against
    // the Auth0 JSON Web Key Set
    const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://fullstackcircle.auth0.com/.well-known/jwks.json'
      }),

      // Validate the audience and the issuer.
      audience: process.env.AUTH0_AUDIENCE,
      issuer: 'https://fullstackcircle.auth0.com/',
      algorithms: ['RS256']
    });`

## NOTE: get the jwksUri & issuer from https://auth0.com/docs/quickstart/backend/nodejs/01-authorization#configuration

` ng build `

` node app.js `

## Open browser and test that API is NOT accessible from browser:

` http://localhost:3000/api/users `

`UnauthorizedError: No authorization token was found` = Good thing!!

## Commit this directory
` git stage client/UserManagement `
