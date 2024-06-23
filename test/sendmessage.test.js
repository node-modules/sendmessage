import { strict as assert } from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import childprocess from 'node:child_process';
import cluster from 'node:cluster';
import workerThreads from 'node:worker_threads';
import mm from 'mm';
import sendmessage from '../dist/esm/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const childFile = path.join(__dirname, 'child.js');

describe('sendmessage.test.js', () => {
  afterEach(mm.restore);

  describe('single process', () => {
    it('should emit message when process is not child process', done => {
      process.once('message', message => {
        assert.deepEqual(message, {
          foo: 'bar',
        });
        done();
      });
      sendmessage(process, { foo: 'bar' });
    });
  });

  describe('child_process.fork()', () => {
    it('should send cross process message', done => {
      const child = childprocess.fork(childFile);
      child.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(child, {
          from: 'master',
          reply: 'this is a reply message send to child',
        });

        child.once('message', function(message) {
          assert.deepEqual(message, {
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child',
            },
          });
          done();
        });
      });
    });

    it('should show warning message when channel closed', done => {
      const child = childprocess.fork(childFile);
      child.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(child, {
          from: 'master',
          disconnect: true,
        });

        child.once('disconnect', () => {
          console.log('child#%d disconnected', child.pid);
          sendmessage(child, {
            from: 'master',
            hi: 'here?',
          });
          done();
        });
      });
    });
  });

  describe('cluster.fork()', () => {
    it('should send cross process message', done => {
      cluster.setupPrimary({
        exec: childFile,
      });
      const child = cluster.fork();
      child.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(child, {
          from: 'master',
          reply: 'this is a reply message send to child',
        });

        child.once('message', function(message) {
          assert.deepEqual(message, {
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child',
            },
          });
          done();
        });
      });
    });

    it('should show warning message when channel closed', done => {
      cluster.setupPrimary({
        exec: childFile,
      });
      const child = cluster.fork();
      child.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(child, {
          from: 'master',
          disconnect: true,
        });

        child.once('disconnect', () => {
          console.log('child#%d disconnected', child.process.pid);
          sendmessage(child, {
            from: 'master',
            hi: 'here?',
          });
          done();
        });
      });
    });
  });

  describe('worker_threads', () => {
    it('should send cross process message', done => {
      const worker = new workerThreads.Worker(childFile);
      worker.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(worker, {
          from: 'master',
          reply: 'this is a reply message send to child',
        });

        worker.once('message', function(message) {
          assert.deepEqual(message, {
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child',
            },
          });
          done();
        });
      });
    });
  });

  describe('SENDMESSAGE_ONE_PROCESS', () => {
    it('should emit when SENDMESSAGE_ONE_PROCESS = true', done => {
      const child = childprocess.fork(childFile);
      mm(process.env, 'SENDMESSAGE_ONE_PROCESS', 'true');
      child.once('message', function(message) {
        assert.deepEqual(message, {
          from: 'child',
          hi: 'this is a message send to master',
        });

        sendmessage(child, {
          from: 'master',
          reply: 'this is a reply message send to child',
        });

        child.once('message', function(msg) {
          assert.deepEqual(msg, {
            from: 'master',
            reply: 'this is a reply message send to child',
          });
          done();
        });
      });
    });
  });
});
