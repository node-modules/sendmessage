/**!
 * sendmessage - test/sendmessage.test.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require('path');
var should = require('should');
var childprocess = require('child_process');
var cluster = require('cluster');
var workerThreads = require('worker_threads');
var mm = require('mm');
var sendmessage = require('../');

describe('sendmessage.test.js', function () {
  afterEach(mm.restore);

  describe('single process', function () {
    it('should emit message when process is not child process', function (done) {
      process.once('message', function (message) {
        message.should.eql({
          foo: 'bar'
        });
        done();
      });
      sendmessage(process, {foo: 'bar'});
    });
  });

  describe('child_process.fork()', function () {
    it('should send cross process message', function (done) {
      var childfile = path.join(__dirname, 'child.js');
      var child = childprocess.fork(childfile);
      child.once('message', function (message) {
        message.should.eql({
          from: 'child',
          hi: 'this is a message send to master'
        });

        sendmessage(child, {
          from: 'master',
          reply: 'this is a reply message send to child'
        });

        child.once('message', function (message) {
          message.should.eql({
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child'
            }
          });
          done();
        });
      });
    });

    it('should show warnning message when channel closed', function (done) {
      var childfile = path.join(__dirname, 'child.js');
      var child = childprocess.fork(childfile);
      child.once('message', function (message) {
        message.should.eql({
          from: 'child',
          hi: 'this is a message send to master'
        });

        sendmessage(child, {
          from: 'master',
          disconnect: true
        });

        child.once('disconnect', function () {
          console.log('child#%d disconnected', child.pid);
          sendmessage(child, {
            from: 'master',
            hi: 'here?'
          });
          done();
        });
      });
    });
  });

  describe('cluster.fork()', function () {
    it('should send cross process message', function (done) {
      var childfile = path.join(__dirname, 'child.js');
      cluster.setupMaster({
        exec: childfile
      });
      var child = cluster.fork();
      child.once('message', function (message) {
        message.should.eql({
          from: 'child',
          hi: 'this is a message send to master'
        });

        sendmessage(child, {
          from: 'master',
          reply: 'this is a reply message send to child'
        });

        child.once('message', function (message) {
          message.should.eql({
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child'
            }
          });
          done();
        });
      });
    });

    it('should show warnning message when channel closed', function (done) {
      var childfile = path.join(__dirname, 'child.js');
      cluster.setupMaster({
        exec: childfile
      });
      var child = cluster.fork();
      child.once('message', function (message) {
        message.should.eql({
          from: 'child',
          hi: 'this is a message send to master'
        });

        sendmessage(child, {
          from: 'master',
          disconnect: true
        });

        child.once('disconnect', function () {
          console.log('child#%d disconnected', child.process.pid);
          sendmessage(child, {
            from: 'master',
            hi: 'here?'
          });
          done();
        });
      });
    });
  });

  describe('worker_threads', function () {
    it('should send cross process message', function (done) {
      var childfile = path.join(__dirname, 'child.js');
      const worker = new workerThreads.Worker(childfile)
      worker.once('message', function (message) {
        message.should.eql({
          from: 'child',
          hi: 'this is a message send to master'
        });

        sendmessage(worker, {
          from: 'master',
          reply: 'this is a reply message send to child'
        });

        worker.once('message', function (message) {
          message.should.eql({
            from: 'child',
            got: {
              from: 'master',
              reply: 'this is a reply message send to child'
            }
          });
          done();
        });
      });
    });
  });

  it('should emit when SENDMESSAGE_ONE_PROCESS = true', function(done) {
    var childfile = path.join(__dirname, 'child.js');
    var child = childprocess.fork(childfile);
    mm(process.env, 'SENDMESSAGE_ONE_PROCESS', 'true');
    var msg;
    child.once('message', function (message) {
      message.should.eql({
        from: 'child',
        hi: 'this is a message send to master'
      });

      sendmessage(child, {
        from: 'master',
        reply: 'this is a reply message send to child'
      });

      child.once('message', function(msg) {
        msg.should.eql({
          from: 'master',
          reply: 'this is a reply message send to child',
        });
        done();
      });
    });
  })
});
