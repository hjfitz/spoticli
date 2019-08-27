import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

const envLoc: string = path.join(process.cwd(), '.env')

const contents: string = fs.readFileSync(envLoc).toString()

console.log(chalk.green('Loading env...'))
console.log(chalk.green('File:'), envLoc)
contents.split('\n').map((line: string): void => {
	const [key, ...vals]: string[] = line.split('=')
	const val: string = vals.join('=')
	process.env[key] = val
	console.log(`Setting "${chalk.bold(key)}" as ${chalk.bold(val)}`)
})

const scopes: string[] = [
	'user-read-playback-state',
	'user-modify-playback-state',
]

const callback: string = 'https://accounts.spotify.com/authorize'

		+ '?response_type=code'
		+ `&client_id=${encodeURIComponent(process.env.SPOTIFY_CLIENT_ID || '')}`
		+ `&scope=${encodeURIComponent(scopes.join(' '))}`
		+ `&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_CALLBACK_URL || '')}`

// create an express app

const doFlow = (): void => {
	console.log(chalk.green('Server started'))
	console.log(`${chalk.yellow('Begin flow:')} ${callback}`)
}

export default doFlow
