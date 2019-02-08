#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	console.log(`\
Usage:
    write-into-redis-stream <stream-name>
Examples:
    echo '{"user": "jane", "text": "hey!"}' | write-into-redis-stream chat-msgs
`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const onError = (err) => {
	console.error(err)
	process.exit(1)
}

const {createClient} = require('redis')
const ndjson = require('ndjson')
const createWriter = require('./writer')

const redis = createClient()

const streamName = argv._[0]
if (!streamName) onError('missing stream-name argument.')
const writer = createWriter(redis, streamName)

writer.once('error', onError)
writer.once('finish', () => redis.quit())
process.stdin.pipe(ndjson.parse()).pipe(writer)
