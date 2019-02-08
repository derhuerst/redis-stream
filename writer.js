'use strict'

const {Writable} = require('stream')

const DEBUG = process.env.NODE_ENV !== 'production'

const isObj = o => o !== null && 'object' === typeof o && !Array.isArray(o)
const serializeItem = (xaddArgs, item) => {
	if (DEBUG && !isObj(item)) throw new Error('item must be an object')
	for (const key of Object.keys(item)) {
		const val = item[key]
		if (DEBUG && 'string' !== typeof val) throw new Error(`item[val] must be a string`)
		xaddArgs.push(key, val)
	}
}

const createWriter = (redis, key) => {
	const write = (item, _, cb) => {
		const args = [key, '*']
		serializeItem(args, item)

		redis.xadd(...args, cb)
	}

	const writev = (items, _, cb) => {
		const args = [key, '*']
		for (let i = 0; i < items.length; i++) serializeItem(args, items[i])

		redis.xadd(...args, cb)
	}

	return new Writable({
		objectMode: true,
		highWaterMark: 16,
		write, writev
	})
}

module.exports = createWriter
