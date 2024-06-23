# Changelog

## [3.0.0](https://github.com/node-modules/sendmessage/compare/v2.0.0...v3.0.0) (2024-06-23)


### ⚠ BREAKING CHANGES

* drop Node.js < 18.19.0 support

part of https://github.com/eggjs/egg/issues/3644

https://github.com/eggjs/egg/issues/5257

### Features

* support cjs and esm both by tshy ([#6](https://github.com/node-modules/sendmessage/issues/6)) ([30acc65](https://github.com/node-modules/sendmessage/commit/30acc65d9359531ad817ccb8195af791805a63c5))

## [2.0.0](https://github.com/node-modules/sendmessage/compare/v1.1.0...v2.0.0) (2023-06-13)


### ⚠ BREAKING CHANGES

* Drop Node.js < 14 support

### Features

* support worker_threads ipc ([#3](https://github.com/node-modules/sendmessage/issues/3)) ([3a27475](https://github.com/node-modules/sendmessage/commit/3a274755a43d8c7f4af6116717409ae2d9d66cea))
* use github action and drop non-lts Node.js support ([#4](https://github.com/node-modules/sendmessage/issues/4)) ([9592a9b](https://github.com/node-modules/sendmessage/commit/9592a9bd9fe880b565475d7583448af46da077f4))

---


1.1.0 / 2016-11-02
==================

  * feat: add more env SENDMESSAGE_ONE_PROCESS (#2)

1.0.5 / 2015-04-14
==================

 * support IS_NODE_DEV_RUNNER env

1.0.4 / 2014-12-04
==================

 * fix: try to detect node-dev env, dont use NODE_ENV

1.0.3 / 2014-11-21
==================

 * use NODE_ENV === 'development'

1.0.2 / 2014-11-21
==================

 * fix missing message on node-dev

1.0.1 / 2014-11-14
==================

 * fix: support cluster.fork() child process

1.0.0 / 2014-11-14
==================

 * first commit
