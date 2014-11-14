/**!
 * sendmessage - index.js
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

module.exports = function send(childprocess, message) {
  if (typeof childprocess.send !== 'function') {
    // not a child process
    return setImmediate(childprocess.emit.bind(childprocess, 'message', message));
  }

  if (childprocess.connected) {
    return childprocess.send(message);
  }

  // just log warnning message
  console.warn('[%s][sendmessage] WARN pid#%s channel closed, nothing send',
    Date(), process.pid);
};
