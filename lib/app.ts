import queryString from 'querystring'
import request from 'request-promise'
import express from 'express'
import emitter from './events'

const app = express()

app.get('/', async (req, res) => {
	const {
		SPOTIFY_CALLBACK_URL: callback,
		SPOTIFY_CLIENT_SECRET: csecret,
		SPOTIFY_CLIENT_ID: cid,
	} = process.env
	const base = 'https://accounts.spotify.com/api/token';
	const body = queryString.stringify({
	  code: req.query.code,
	  grant_type: 'authorization_code',
	  redirect_uri: encodeURI(callback || 'http://lvh.me:5000/'),
	});
	const auth = Buffer.from(`${cid}:${csecret}`).toString('base64')
	const opts = {
	  body,
	  method: 'POST',
	  uri: base,
	  headers: {
		'Content-Length': body.length,
		'Content-Type': 'application/x-www-form-urlencoded',
		Authorization: `Basic ${auth}`,
	  },
	};
	// send body to google and wait for AT/ID Token
	const resp = await request(opts);
	// begin the player
	emitter.emit('token-get', JSON.parse(resp))
	res.send('<script>window.close()</script>')
})

export default app
