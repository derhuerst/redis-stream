'use strict'

const {Readable} = require('stream')

const BEGINNING = '0'

const defaults = {
	live: true,
	waitTimeout: Infinity,
	history: false,
	limit: Infinity
}

const createReader = (redis, key, opt = {}) => {
	opt = Object.assign({}, defaults, opt)
	const {live, history, limit} = opt
	const block = opt.waitTimeout === Infinity ? 0 : opt.waitTimeout

	let cursor = history ? BEGINNING : '$'
	let itemsRead = 0

	const onData = (err, res) => {
		if (err) {
			out.emit('error', err)
			return
		}

		// end of stream?
		if (!res) {
			out.push(null)
			return
		}

		// unpack result, move cursor
		const rows = res[0][1] // get rows for the only stream we queried
		const nrOfRows = rows.length
		cursor = rows[nrOfRows - 1][0]
		itemsRead += nrOfRows

		// parse rows and emit items
		for (let i = 0; i < nrOfRows; i++) {
			const raw = rows[i][1]
			const item = Object.create(null)
			for (let i = 0; i < raw.length; i += 2) item[raw[i]] = raw[i + 1]
			out.push(item)
		}

		if (itemsRead >= limit) out.push(null)
	}

	const read = (size) => {
		const count = Math.min(size, limit)
		if (live) redis.xread('count', count, 'block', block, 'streams', key, cursor, onData)
		else redis.xread('count', count, 'streams', key, cursor, onData)
	}

	const out = new Readable({
		objectMode: true,
		highWaterMark: 32,
		read
	})
	return out
}

module.exports = createReader
