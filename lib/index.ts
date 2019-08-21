import chalk from 'chalk'
import request from 'request-promise'

import emitter from './events'
import app from './app'
import doFlow from './flow'

const port: number = parseInt(process.env.PORT || '5000', 10)
const server = app.listen(port, doFlow)

const clear = (): void => console.log('\033[2J');

interface SpotifyToken {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
	scope: string
}

interface NowPlaying {
	track: string
	artist: string
	album: string
	length: number
	place: number
}

async function paintPlaying(token: SpotifyToken): Promise<void> {
	const playing = await getPlaying(token.access_token)
	let elapsed = 0
	let interval: NodeJS.Timeout = setInterval(async () => {
		clear()
		console.log(
			`${chalk.bold('[artist]')}\t${playing.artist}`
			+ `\n${chalk.bold('[album]')} \t${playing.album}`
			+ `\n${chalk.bold('[track]')} \t${playing.track}`
		)
		// figure out % played
		const percPlayed: number= ~~((playing.place / playing.length) * 10)
		const playedBar: string = Array.from({length: percPlayed}).map(_ => '==').join('')
		const unplayedBar: string = Array.from({length: (10 - percPlayed)}).map(_ => '--').join('')
		const played: string = parseMS(playing.place)
		const length: string = parseMS(playing.length)
		console.log(`${played}/${length} ${playedBar}*${unplayedBar}`)
		playing.place += 1000
		elapsed += 1

		// in case the song changes - check every 20s
		if (++elapsed % 20 === 0) {
			const newPlaying = await getPlaying(token.access_token)
			if (newPlaying.track !== playing.artist) {
				clearInterval(interval)
				paintPlaying(token)
			}
		}

		// song finished? get new song
		if (playing.place >= playing.length) {
			clearInterval(interval)
			paintPlaying(token)
		}

	}, 1000)
}

function parseMS(ms: number): string {
	const minutes: number = Math.floor(ms / 60000);
	const seconds: unknown = ((ms % 60000) / 1000).toFixed(0);
	return minutes + ":" + ((<number>seconds) < 10 ? '0' : '') + seconds;
}

async function getPlaying(at: string): Promise<NowPlaying> {
	const resp = await request({
		method: 'GET',
		uri: 'https://api.spotify.com/v1/me/player/currently-playing',
		headers: {
			Authorization: `Bearer ${at}`
		}
	})

	const {progress_ms, item} = JSON.parse(resp)
	const {name: album} = item.album
	const {name: artist} = item.artists[0]
	const {name: track, duration_ms} = item
	return {
		track,
		artist,
		album,
		length: duration_ms,
		place: progress_ms,
	}
}

emitter.on('token-get', async (token: SpotifyToken): Promise<void> => {
	paintPlaying(token)
	/**
	 * === [playing] ===
	 * [track]:  Soul to Squeeze
	 * [artist]: Red Hot Chili Peppers
	 * [album]:  Stadium Arcadium 
	 * 2:33/4:50 ==============-------
	 */
})