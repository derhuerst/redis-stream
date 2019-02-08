'use strict'

const {createClient} = require('redis')
const {createWriter, createReader} = require('.')

const onError = (err) => {
	console.error(err)
	process.exit(1)
}

// Node process A
const redis1 = createClient()
const reader = createReader(redis1, 'some-stream-name', {limit: 2})
reader.once('error', onError)
reader.once('end', () => redis1.quit())
reader.on('data', console.log)

// Node process B
const redis2 = createClient()
const writer = createWriter(redis2, 'some-stream-name')
writer.once('error', onError)
writer.once('finish', () => redis2.quit())

setTimeout(() => {
	writer.write({foo: 'bar'})
	writer.end({hey: 'there!'})
}, 100)
