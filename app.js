var http = require('http');
var express = require('express');
var Session = require('express-session');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var api = require('./client_id.json');
const ClientId = api.web.client_id;
const ClientSecret = api.web.client_secret;
const RedirectionUrl = "http://localhost:4040/oauthCallback";

var app = express();
app.use(Session({
    secret: 'raysources-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

app.use("/oauthCallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
			console.log(tokens);
      if(!err) {
				
        oauth2Client.setCredentials(tokens);
        session["tokens"]=tokens;
        res.send(`<a href="/details">details</a>`);
      }
      else{
        res.send(`fails`);
      }
    });
});

app.use("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);
		console.log('tokens', req.session["tokens"]);

    var p = new Promise(function (resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
					console.log('response', response);
            resolve(response || err);
        });
    }).then(function (data) {
			console.log(data);
        res.send(`
            <img src=${data.image.url} >
            <h3>Hello ${data.displayName}</h3>
        `);
    })
});

app.use("/", function (req, res) {
    var url = getAuthUrl();
    res.send(`<a href="${url}">login</a>`)
});


var port = 4040;
var server = http.createServer(app);
server.listen(port);
server.on('listening', function () {
    console.log(`listening to ${port}`);
});
