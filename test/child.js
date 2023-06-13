/**!
 * sendmessage - test/child.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var { isMainThread, parentPort } = require('worker_threads');
var sendmessage = require('../');


var listener = function (message) {
  if (message.disconnect) {
    process.disconnect();
  }

  sendmessage(process, {
    from: 'child',
    got: message
  });
}
process.on('message', listener);
if (!isMainThread) {
  // worker thread
  parentPort.on('message', listener)
}

sendmessage(process, {
  from: 'child',
  hi: 'this is a message send to master'
});
