const http = require('http')
const {URL} = require('url')


function post(url, body) {
	const {hostname, port, pathname: path} = new URL(url)
	return new Promise((res, rej) => {
		const req = http.request({
			hostname,
			port,
			path,
			method: 'POST',
			headers: {'content-type': 'application/json'}
		}, (resp) => {
			resp.resume()
			resp.on('end', () => res({body, resp}))
		})
		req.write(JSON.stringify(body))
		req.end()
		req.on('error', rej)
	})
}

async function main() {
	const [,,phase, time, repo, rawBranch, data, url, buildid] = process.argv
	const branch = rawBranch.replace('refs/head/', '')
	try {
		const {resp} = await post(url, {phase, time, repo, branch, data, buildid})
		if (resp.statusCode > 399) {
			process.exit(resp.statusCode)
		}
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
	// exit on 4XX and 5XX errors
}

main()
