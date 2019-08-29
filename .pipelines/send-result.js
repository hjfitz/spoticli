const request = require('request-promise')

const [,,phase, time, repo, branch, data, url] = process.argv

const body = {phase, time, repo, branch, data}

async function main() {
	const resp = await request.post(url, {
		body,
		json: true
	})
	console.log(resp)
}

main()
