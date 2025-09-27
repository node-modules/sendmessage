import { debuglog } from 'node:util';
import { isMainThread, parentPort } from 'node:worker_threads';
import { EventEmitter } from 'node:events';
import cluster from 'node:cluster';

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
  if (child.process?.connected) {
    debug('child is cluster.fork() process, send: %j', message);
    return child.send!(message);
  }

  // childprocess.fork(): child is process
  if (child.connected) {
    debug('child.connected: %s, cluster.isWorker: %s, cluster.isPrimary: %s',
      child.connected, cluster.isWorker, cluster.isPrimary);
    if (cluster.isWorker || cluster.isPrimary) {
      debug('child is cluster.fork() process, send: %j', message);
      return child.send!(message);
    }

    if (process.env.VITEST === 'true' && process.env.VITEST_WORKER_ID) {
      debug('child is vitest worker process, VITEST_WORKER_ID: %s, emit sendmessage-to-self: %j',
        process.env.VITEST_WORKER_ID, message);
      return setImmediate(child.emit.bind(child, 'sendmessage-to-self', message));
    }
    debug('child is childprocess.fork() process, send: %j', message);
    return child.send!(message);
  }

  // just log warning message
  const pid = child.process ? child.process.pid : child.pid;
  const err = new Error('channel closed');
  console.warn('[%s][sendmessage] WARN pid#%s channel closed, nothing send\nstack: %s',
    Date(), pid, err.stack);
}

export { sendmessage };
