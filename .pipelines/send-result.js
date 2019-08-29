const request = require('request-promise')

const [,,url, type, id, payload] = process.argv

console.log({url, type, payload})

async function main() {
	const resp = await request.post(url, {
		body: {
			id,
			payload,
			type
		},
		json: true
	})
	console.log(resp)
}

main()
