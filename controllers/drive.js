import google from 'googleapis';
import request from 'superagent';
import axios from 'axios';
import fs from 'fs';
const OAuth2 = google.auth.OAuth2;
const api = require('../client_id.json');
const ClientId = api.web.client_id;
const ClientSecret = api.web.client_secret;
const RedirectionUrl = "http://localhost:4040/oauthCallback";
const oauth2Client = new OAuth2(
  ClientId,
  ClientSecret,
  RedirectionUrl
);

const driveApi = {
	getAccess(req, res) {
		const scopes = [
			'https://www.googleapis.com/auth/drive.appfolder', 
			'https://www.googleapis.com/auth/drive.file'
		];
		
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

			return res.json({success: true});
		});
	},

	upload(req, res) {
		const {file} = req;
		console.log(file);
		// request
		// .post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media')
		// .set('Content-Type', file.mimetype)
		// .set('Content-Length', file.size)
		// .set('Authorization', `Bearer ya29.GlzqA3ZgwEfbUjHcDAO9-4GM92DTIKAK7k86ZBq6T-xEdsamu6iJp3i_QbbI_vdxLxX26Z312mME3Ij-lloxrqoYzLO-sapH8ht_QYv8KBROMFZKV--gzl10o5u6mA`)
		// .send({data: fs.createReadStream(`${__dirname.replace('controllers', '')}/${file.path}`)})
		// .end((err, res) => console.log(res.body));
		let token = 'ya29.GlzqA51tZSX7UHc5HxV7eiw1nGAxVYplsMcv8ZrbjVEpjmiAqGVfxZi644jtL5nO36g_tTvsAdkQ6CfYi4KVkq3FGVdRuQdHk6AI-oWR-y7enB-p83k7ZvJrREe-Sg';
		axios
		.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', fs.createReadStream(`${__dirname.replace('controllers', '')}/${file.path}`), {	
			headers: {
				'Content-Type': file.mimetype,
				'Content-Length': file.size,
				'Authorization': `Bearer ${token}`
			}}
		)
		.then(function (response) {
			console.log(response.data);
		})
		.catch((err) => console.log(err));

	},

	download() {
		`https://www.googleapis.com/drive/v3/files/${id}?alt=media`
	}
}

export default driveApi;