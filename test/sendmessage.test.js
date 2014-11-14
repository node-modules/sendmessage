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
var sendmessage = require('../');

describe('sendmessage.test.js', function () {
  it('should emit message when process is not child process', function (done) {
    process.once('message', function (message) {
      message.should.eql({
        foo: 'bar'
      });
      done();
    });
    sendmessage(process, {foo: 'bar'});
  });

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
