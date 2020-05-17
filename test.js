'use strict'

const {createClient} = require('redis')
const {deepStrictEqual, strictEqual, ok} = require('assert')
const {createWriter, createReader} = require('.')

const onError = (err) => {
	console.error(err)
	process.exit(1)
}

const CHUNKS = [
	Object.assign(Object.create(null), {foo: 'bar'}),
	Object.assign(Object.create(null), {hey: 'there!'}),
	[1, 2, 3],
]
const CHUNKS_TO_READ = 2

// reader

const redis1 = createClient()
const reader = createReader(redis1, 'some-stream-name', {
	limit: CHUNKS_TO_READ,
})
reader.once('error', onError)

let chunkI = 0, ended = false
reader.on('data', (chunk) => {
	deepStrictEqual(chunk, CHUNKS[chunkI], 'chunk ' + chunkI)
	chunkI++
})
reader.once('end', () => {
	strictEqual(chunkI, CHUNKS_TO_READ, 'wrong nr of received chunks')
	ended = true
	redis1.quit()
	console.info('looks good')
})
setTimeout(() => {
	ok(ended, 'no end event received')
}, 1000)

// writer

const redis2 = createClient()
const writer = createWriter(redis2, 'some-stream-name')
writer.once('error', onError)

writer.once('finish', () => redis2.quit())
setTimeout(() => {
	writer.write(CHUNKS[0])
	writer.end(CHUNKS[1])
}, 100)
