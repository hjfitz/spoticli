const request = require('request-promise')

const [,,url, type, id, branch, payload] = process.argv

console.log({url, type, payload})

async function main() {
	const resp = await request.post(url, {
		body: {id, payload, type, branch},
		json: true
	})
	console.log(resp)
}

main()
