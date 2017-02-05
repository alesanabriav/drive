import google from 'googleapis';
const OAuth2 = google.auth.OAuth2;
const api = require('../client_id.json');
const ClientId = api.web.client_id;
const ClientSecret = api.web.client_secret;
const RedirectionUrl = "http://localhost:4040/oauthCallback";
var oauth2Client = new OAuth2(
  ClientId,
  ClientSecret,
  RedirectionUrl
);

const driveApi = {
	getAccess(req, res) {
		const scopes = ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file'];
		
		let url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
		});

		return res.json(url);
	},

	getTokens(req, res) {
		const code = req.query.code;
		oauth2Client.getToken(code, function (err, tokens) {
 	 		// Now tokens contains an access_token and an optional refresh_token. Save them.
			if (err) return console.error(err);
			
			oauth2Client.setCredentials(tokens);
			req.session['credentials'] = tokens;
			return res.json(req.session);
		});
	},

	refreshToken(req, res) {
		let tokens = req.session['credentials'];
		oauth2Client.setCredentials(tokens);

		oauth2Client.refreshAccessToken(function(err, tokens) {
			if (err) return console.error(err);
			oauth2Client.setCredentials(tokens);
			console.log(oauth2Client);
			return res.json({success: true});
		});
	},

	upload() {
		var drive = google.drive({
			version: 'v2',
			auth: oauth2Client
		});
	}
}

export default driveApi;