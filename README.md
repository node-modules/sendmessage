# sendmessage

[![NPM version][npm-image]][npm-url]
[![CI](https://github.com/node-modules/sendmessage/actions/workflows/nodejs.yml/badge.svg)](https://github.com/node-modules/sendmessage/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/sendmessage.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sendmessage
[download-image]: https://img.shields.io/npm/dm/sendmessage.svg?style=flat-square
[download-url]: https://npmjs.org/package/sendmessage
[codecov-image]: https://codecov.io/gh/node-modules/sendmessage/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/sendmessage

Send a cross process message if message channel is connected.
Avoid [channel closed](https://github.com/joyent/node/blob/cfcb1de130867197cbc9c6012b7e84e08e53d032/lib/child_process.js#L411) error throw out.

## Install

```bash
npm install sendmessage --save
```

## Usage

### master.js

```ts
import { fork } from 'node:child_process';
import { sendmessage } from 'sendmessage';

const worker = fork('./worker.js');

sendmessage(worker, { hi: 'this is a message to worker' });
```

### worker.js

```ts
import { sendmessage } from 'sendmessage';

sendmessage(process, { hello: 'this is a message to master' });
```

## API

### #sendmessage(childProcess, message)

Send a cross process message.
If a process is not child process, this will just call `process.emit('message', message)` instead.

- childProcess: child process instance
- message: the message need to send

```js
sendmessage(process, { hello: 'this is a message to master' });
```

You can switch to `process.emit('message', message)` using `process.env.SENDMESSAGE_ONE_PROCESS`

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/sendmessage)](https://github.com/node-modules/sendmessage/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
