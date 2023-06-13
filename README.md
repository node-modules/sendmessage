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

```js
var childprocess = require('child_process');
var sendmessage = require('sendmessage');

var worker = childprocess.fork('./worker.js');
sendmessage(worker, {hi: 'this is a message to worker'});
```

### worker.js

```js
var sendmessage = require('sendmessage');

sendmessage(process, {hello: 'this is a message to master'});
```

## API

### #sendmessage(childprocess, message)

Send a cross process message.
If a process is not child process, this will just call `process.emit('message', message)` instead.

- childprocess: child process instance
- message: the message need to send

```js
sendmessage(process, {hello: 'this is a message to master'});
```

You can switch to `process.emit('message', message)` using `process.env.SENDMESSAGE_ONE_PROCESS`

## Test

```bash
npm install
npm test
```

### Coverage

```bash
npm run ci
```

## License

(The MIT License)

Copyright (c) 2014 - 2015 fengmk2 <fengmk2@gmail.com> and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/360661?v=4" width="100px;"/><br/><sub><b>popomore</b></sub>](https://github.com/popomore)<br/>|[<img src="https://avatars.githubusercontent.com/u/32174276?v=4" width="100px;"/><br/><sub><b>semantic-release-bot</b></sub>](https://github.com/semantic-release-bot)<br/>|[<img src="https://avatars.githubusercontent.com/u/7581901?v=4" width="100px;"/><br/><sub><b>sjfkai</b></sub>](https://github.com/sjfkai)<br/>|
| :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Tue Jun 13 2023 20:42:15 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
