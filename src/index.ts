import { debuglog } from 'node:util';
import { isMainThread, parentPort } from 'node:worker_threads';
import { EventEmitter } from 'node:events';

const debug = debuglog('sendmessage');

let IS_NODE_DEV_RUNNER = /node\-dev$/.test(process.env._ || '');
if (!IS_NODE_DEV_RUNNER && process.env.IS_NODE_DEV_RUNNER) {
  IS_NODE_DEV_RUNNER = true;
}
debug('IS_NODE_DEV_RUNNER: %s', IS_NODE_DEV_RUNNER);

export interface ChildProcessOrWorker extends EventEmitter {
  // Worker
  postMessage?(message: unknown): void;
  // ChildProcess
  send?(message: unknown): boolean;
  connected?: boolean;
  pid?: number;
  process?: {
    connected?: boolean;
    pid?: number;
  };
}

export default function sendmessage(child: ChildProcessOrWorker, message: unknown) {
  if (
    isMainThread // not in worker thread
    && typeof child.postMessage !== 'function' // child is not worker
    && typeof child.send !== 'function'
  ) {
    debug('child is master process, emit message: %j', message);
    // not a child process
    return setImmediate(child.emit.bind(child, 'message', message));
  }

  if (IS_NODE_DEV_RUNNER || process.env.SENDMESSAGE_ONE_PROCESS) {
    // run with node-dev, only one process
    // https://github.com/node-modules/sendmessage/issues/1
    debug('node-dev: %s or SENDMESSAGE_ONE_PROCESS: %s, emit message: %j',
      IS_NODE_DEV_RUNNER, process.env.SENDMESSAGE_ONE_PROCESS, message);
    return setImmediate(child.emit.bind(child, 'message', message));
  }

  // child is worker
  if (typeof child.postMessage === 'function') {
    debug('child is worker, postMessage: %j', message);
    return child.postMessage(message);
  }
  // in worker thread
  if (!isMainThread) {
    debug('in worker thread, parentPort.postMessage: %j', message);
    return parentPort!.postMessage(message);
  }

  // cluster.fork(): child.process is process
  // childprocess.fork(): child is process
  const connected = child.process ? child.process.connected : child.connected;

  if (connected) {
    debug('child is process, send: %j', message);
    return child.send!(message);
  }

  // just log warning message
  const pid = child.process ? child.process.pid : child.pid;
  const err = new Error('channel closed');
  console.warn('[%s][sendmessage] WARN pid#%s channel closed, nothing send\nstack: %s',
    Date(), pid, err.stack);
}
