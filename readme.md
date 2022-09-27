# redis-stream

**[Redis 5 Streams](https://redis.io/topics/streams-intro) as [readable & writable Node streams](https://nodejs.org/api/stream.html).** Plus a command line interface.

[![npm version](https://img.shields.io/npm/v/@derhuerst/redis-stream.svg)](https://www.npmjs.com/package/@derhuerst/redis-stream)
[![build status](https://api.travis-ci.org/derhuerst/redis-stream.svg?branch=master)](https://travis-ci.org/derhuerst/redis-stream)
[![Prosperity/Apache license](https://img.shields.io/static/v1?label=license&message=Prosperity%2FApache&color=0997E8)](#license)
![minimum Node.js version](https://img.shields.io/node/v/@derhuerst/redis-stream.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installation

```shell
npm install @derhuerst/redis-stream
```


## Command line usage

```
Usage:
    write-into-redis-stream <stream-name>
Examples:
    echo '{"user": "jane", "text": "hey!"}' | write-into-redis-stream chat-msgs
```

```
Usage:
    read-from-redis-stream <stream-name> [--history] [--live [--waitTimoout <ms>]] [--limit <n>]
Options:
	--live             Wait for newly added items? Default: true
	--waitTimeout  -t  How long to wait for newly added items. Default: Infinity
	--history          Read all past items from the stream? Default: false
	--limit        -l  Maximum number of items to read. Default: Infinity
Examples:
    read-from-redis-stream chat-msgs --live --limit 1000
```


## Usage with JavaScript

### Writing to a Redis Stream

```js
const {createClient} = require('redis')
const createWriter = require('@derhuerst/redis-stream/writer')

const redis = createClient()
const writer = createWriter(redis, 'some-stream-name')
writer.once('finish', () => redis.quit())
writer.on('error', console.error)

writer.write({foo: 'bar'})
writer.end({hey: 'there!'})
```

### Reading from a Redis Stream

```js
const {createClient} = require('redis')
const createReader = require('@derhuerst/redis-stream/reader')

const redis = createClient()
const reader = createReader(redis, 'some-stream-name')
reader.on('data', console.log)
reader.on('error', console.error)
```


## API

### `createWriter(redis, streamName)`

Returns a [readable stream](https://nodejs.org/api/stream.html#stream_writable_streams) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode).

### `createReader(redis, streamName, opt = {})`

Returns a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode). `opt` may be an object with the following entries:

- `live`: Wait for newly added items? Default: `true`
- `waitTimeout`: How long to wait for newly added items. Default: `Infinity`
- `history`: Read all past items from the stream? Default: `false`
- `limit`: Maximum number of items to read. Default: `Infinity`


## License

This project is dual-licensed: **My contributions are licensed under the [*Prosperity Public License*](https://prosperitylicense.com), [contributions of other people](https://github.com/derhuerst/redis-stream/graphs/contributors) are licensed as [Apache 2.0](https://apache.org/licenses/LICENSE-2.0)**.

> This license allows you to use and share this software for noncommercial purposes for free and to try this software for commercial purposes for thirty days.

> Personal use for research, experiment, and testing for the benefit of public knowledge, personal study, private entertainment, hobby projects, amateur pursuits, or religious observance, without any anticipated commercial application, doesn’t count as use for a commercial purpose.

[Get in touch with me](https://jannisr.de/) to buy a commercial license or read more about [why I sell private licenses for my projects](https://gist.github.com/derhuerst/0ef31ee82b6300d2cafd03d10dd522f7).


## Contributing

If you have a question or need support using `redis-stream`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/redis-stream/issues).

By contributing, you agree to release your modifications under the [Apache 2.0 license](LICENSE-APACHE).
