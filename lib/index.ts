import chalk from 'chalk'
import request from 'request-promise'

import emitter from './events'
import app from './app'
import doFlow from './flow'
import setListeners from './control';

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

interface Track {
	name: string
	artist: string
	album: string
	length: string
	playing: boolean
}

interface NowPlaying {
	track: string
	artist: string
	album: string
	length: number
	place: number
	playlist?: Track[]
}

function paintProgress(playing: NowPlaying) {
	// figure out % played
	const percPlayed: number= ~~((playing.place / playing.length) * 10)
	const playedBar: string = Array.from({length: percPlayed}).map(_ => '==').join('')
	const unplayedBar: string = Array.from({length: (10 - percPlayed)}).map(_ => '--').join('')
	const played: string = parseMS(playing.place)
	const length: string = parseMS(playing.length)
	console.log(`${played}/${length} ${playedBar}*${unplayedBar}`)
	playing.place += 1000
}

// todo: console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
async function paintPlaying(token: SpotifyToken): Promise<void> {
	const playing = await getPlaying(token.access_token)
	let elapsed = 0
	let interval: NodeJS.Timeout = setInterval(async () => {
		clear()
		if ('playlist' in playing) {
			const cur = [...playing.playlist]
			cur.splice(process.stdout.rows - 2)
			cur.forEach((track) => {
				const out: string = `${chalk.blue(track.artist)} - ${chalk.green(track.name)} ${chalk.blue(track.album)} - ${chalk.magenta(track.length)}`
				if (track.playing) console.log('[np]', out)
				else console.log(out)
			})
		}

		
		paintProgress(playing)
		// paint playing info
		console.log(`${chalk.red('Playing')}:\t${chalk.blue(playing.artist)} * ${chalk.green(playing.track)} ${chalk.blue(`(${playing.album})`)}`)
		// console.log(`${chalk.bold('[artist]')}\t${playing.artist}`)
		// console.log(`${chalk.bold('[album]')} \t${playing.album}`)
		// console.log(`${chalk.bold('[track]')} \t${playing.track}`)

		elapsed += 1
		// paint playlist

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

// todo: type this better
const parseTrack = (track: any, playing: {title: any, album: any}): Track => {
	const {name, artists, album, duration_ms} = track
	const albumTitle = album.name
	const trackArtists = artists.map(artist => artist.name).join(', ')
	const isplaying = (playing.title === name && playing.album === albumTitle)
	return {
		name,
		artist: trackArtists,
		album: albumTitle,
		length: parseMS(duration_ms),
		playing: isplaying
	}
}

async function getPlaying(at: string): Promise<NowPlaying> {
	const resp = await request({
		method: 'GET',
		uri: 'https://api.spotify.com/v1/me/player/currently-playing',
		headers: {
			Authorization: `Bearer ${at}`
		}
	})
	const {progress_ms, item, context} = JSON.parse(resp)
	const {name: album} = item.album
	const {name: artist} = item.artists[0]
	const {name: track, duration_ms} = item
	const {uri} = context
	if (uri.includes('playlist')) {
		// attempt to get playlist information and shorten it
		const id = uri.split(':').pop()
		const playlist = await request.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
			headers: {
				Authorization: `Bearer ${at}`
			}
		})
		const {items} = JSON.parse(playlist)
		const formattedPlayist: Track[] = items.map(item => parseTrack(item.track, {title: track, album}))
		return {
			track,
			artist,
			album,
			length: duration_ms,
			place: progress_ms,
			playlist: formattedPlayist
		}
	}
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
	setListeners(token.access_token)
})