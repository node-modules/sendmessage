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

var sendmessage = require('../');

process.on('message', function (message) {
  if (message.disconnect) {
    console.log('process#%d disconnect()', process.pid);
    process.disconnect();
  }

  sendmessage(process, {
    from: 'child',
    got: message
  });
});

sendmessage(process, {
  from: 'child',
  hi: 'this is a message send to master'
});
