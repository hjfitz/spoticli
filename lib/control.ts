import request, { RequestPromise } from 'request-promise'
import readline from 'readline'

const next = (at: string): RequestPromise => request.post({
	uri: 'https://api.spotify.com/v1/me/player/next',
	headers: {
		Authorization: `Bearer ${at}`,
	},
})

const prev = (at: string): RequestPromise => request.post({
	uri: 'https://api.spotify.com/v1/me/player/previous',
	headers: {
		Authorization: `Bearer ${at}`,
	},
})


const getStatus = (at: string): RequestPromise => request.get({
	uri: 'https://api.spotify.com/v1/me/player',
	headers: {
		Authorization: `Bearer ${at}`,
	},
})

const play = (at: string): RequestPromise => request.put({
	uri: 'https://api.spotify.com/v1/me/player/play',
	headers: {
		Authorization: `Bearer ${at}`,
	},
})

const pause = (at: string): RequestPromise => request.put({
	uri: 'https://api.spotify.com/v1/me/player/pause',
	headers: {
		Authorization: `Bearer ${at}`,
	},
})

export default function setListeners(at: string): void {
	// next POST https://api.spotify.com/v1/me/player/next
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.on('keypress', async (str, key): Promise<void> => {
		if (key.ctrl && key.name === 'c') {
			process.exit();
		} else if (key.name === 'right') {
			next(at)
		} else if (key.name === 'left') {
			prev(at)
		} else if (key.name === 'space') {
			const resp = await getStatus(at)
			const {is_playing} = JSON.parse(resp)
			if (is_playing) pause(at)
			else play(at)
		}
	});
}
