#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'live', 'l',
		'history', 'h'
	]
})

if (argv.help || argv.h) {
	console.log(`\
Usage:
    read-from-redis-stream <stream-name> [--history] [--live [--waitTimoout <ms>]] [--limit <n>]
Options:
	--live             Wait for newly added items? Default: true
	--waitTimeout  -t  How long to wait for newly added items. Default: Infinity
	--history          Read all past items from the stream? Default: false
	--limit        -l  Maximum number of items to read. Default: Infinity
Examples:
    read-from-redis-stream chat-msgs --live --limit 1000
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
const createReader = require('./reader')

const redis = createClient()

const waitTimeout = argv['wait-timeout'] || argv.t
const limit = argv.limit || argv.l
const opt = {
	live: !!argv.live,
	waitTimeout: waitTimeout ? parseInt(waitTimeout) : 0,
	history: !!argv.history,
	limit: limit ? parseInt(limit) : 0
}

const streamName = argv._[0]
if (!streamName) onError('missing stream-name argument.')
const reader = createReader(redis, streamName, opt)

reader.once('error', onError)
reader.once('end', () => redis.quit())
reader.pipe(ndjson.stringify()).pipe(process.stdout)
