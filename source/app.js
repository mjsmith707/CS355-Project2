// import libraries
var express = require('express'),
    ejs     = require('ejs'),
    bodyParser = require('body-parser'),
    xml2js	= require('xml2js'),
    fs      = require('fs'),
    multer  = require('multer');

// import routes
var routes = require('./controller/index.js');
var match_route = require('./controller/match.js');
var player_route  = require('./controller/player.js');
var admin_route = require('./controller/admin.js');

// initialize express web application framework
// http://expressjs.com/
var app = express();

// Multipart File handling
app.use(multer({ dest: './public/files/'}));

// allow json data to be parsed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//configure template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

// example of a global variable that can be passed to a template
app.set('subtitle', 'CPMA Maxstats');

//configure routes
app.use('/', routes);
app.use('/match', match_route);
app.use('/player', player_route);
app.use('/admin', admin_route);

// configure static directory for javascript, css, etc.
app.use(express.static('public'));

app.set('port', 8041);  //use your own port
app.listen(app.get('port'));
console.log("Express server listening on port", app.get('port'));