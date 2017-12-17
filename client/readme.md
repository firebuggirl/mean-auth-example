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
