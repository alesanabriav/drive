import http from 'http';
import express from 'express';
import Session from 'express-session';
import google from 'googleapis';
import mongoose from 'mongoose';

const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;
const api = require('./client_id.json');
const ClientId = api.web.client_id;
const ClientSecret = api.web.client_secret;
const RedirectionUrl = "http://localhost:4040/oauthCallback";

mongoose.connect('mongodb://localhost/drive');
const app = express();

app.get('/', (req, res) => {
    return res.sendFile(`${__dirname}/public/index.html`);
});

var server = http.createServer(app);
server.listen(4040);
