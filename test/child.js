const { isMainThread, parentPort } = require('worker_threads');
const sendmessage = require('..');

const listener = function(message) {
  if (message.disconnect) {
    process.disconnect();
  }

  sendmessage(process, {
    from: 'child',
    got: message,
  });
};
process.on('message', listener);
if (!isMainThread) {
  // worker thread
  parentPort.on('message', listener);
}

sendmessage(process, {
  from: 'child',
  hi: 'this is a message send to master',
});
