const { isMainThread, parentPort } = require('worker_threads');

let IS_NODE_DEV_RUNNER = /node\-dev$/.test(process.env._ || '');
if (!IS_NODE_DEV_RUNNER && process.env.IS_NODE_DEV_RUNNER) {
  IS_NODE_DEV_RUNNER = true;
}

module.exports = function send(child, message) {
  if (
    isMainThread // not in worker thread
    && typeof child.postMessage !== 'function' // child is not worker
    && typeof child.send !== 'function'
  ) {
    // not a child process
    return setImmediate(child.emit.bind(child, 'message', message));
  }

  if (IS_NODE_DEV_RUNNER || process.env.SENDMESSAGE_ONE_PROCESS) {
    // run with node-dev, only one process
    // https://github.com/node-modules/sendmessage/issues/1
    return setImmediate(child.emit.bind(child, 'message', message));
  }

  // child is worker
  if (typeof child.postMessage === 'function') {
    return child.postMessage(message);
  }
  // in worker thread
  if (!isMainThread) {
    return parentPort.postMessage(message);
  }

  // cluster.fork(): child.process is process
  // childprocess.fork(): child is process
  const connected = child.process ? child.process.connected : child.connected;

  if (connected) {
    return child.send(message);
  }

  // just log warnning message
  const pid = child.process ? child.process.pid : child.pid;
  const err = new Error('channel closed');
  console.warn('[%s][sendmessage] WARN pid#%s channel closed, nothing send\nstack: %s',
    Date(), pid, err.stack);
};
