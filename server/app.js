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
// import environmental variables from our variables.env file

var port = 3000;
var app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '../client/UserManagement/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set("userdb",db);
app.use('/', index);
app.use("/api",users);

app.listen(port, function(){
    console.log('Server started on port '+port);
});
