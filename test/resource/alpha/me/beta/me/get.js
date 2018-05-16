/* eslint-disable no-trailing-spaces, no-irregular-whitespace */
/**
 * Copyright (c) 2015 by Coder by Blood, Inc. All rights reserved.
 * 
 * The Lifecycle functions are called in the order they are defined in this file.
 * All functions are optional except 'respond(msg)'.
 * If defined, the first parameter 'msg' has req, res properties which give you access to the
 * http request and http response -and- es6 Promises must always be returned
 * 
 * Example Directory Structure
 * .
 * ├── solos  <-- configurable root directory - see config
 * │   ├── get.js  <-- GET http://domain.com/
 * │   ├── alpha
 * │   │   ├── get.js  <-- GET http://domain.com/alpha/
 * │   │   └── me  <-- 'me' is a special directory name that signals express entity loading
 * │   │       ├── beta
 * │   │       │   └── me
 * │   │       │       └── gama
 * │   │       │           └── put.js  <-- PUT http://domain.com/alpha/:alpha/beta/:beta/gama/
 * │   │       ├── post.js  <-- POST http://domain.com/alpha/:alpha/
 * │   │       └── sample
 * │   │           └── get.js  <-- GET http://domain.com/alpha/:alpha/sample/
 * │   ├── beta
 * │   │   └── me
 * │   │       └── sample
 * │   │           └── delete.js  <-- DELETE http://domain.com/beta/:beta/sample/
 * │   └── entities
 * │       ├── alpha-entity.js  <-- binding into req.solos_context.entities.alpha for /:alpha/
 * │       └── beta-entity.js  <-- binding into req.solos_context.entities.beta for /:beta/
 */
/* eslint-enable */

'use strict';

/**
 * Lifecycle function name that indicates a request to execute the method has been received.
 * The request has been authenticated <strong>BUT NOT authorized</strong> as this point
 * in the lifecycle!
 */
exports.request_received = function requestReceived(msg) {
  msg.logger.debug('Callback successful', {
    method: 'receive',
  });
  return Promise.resolve(msg);
};

/**
 * Lifecycle function name for validating the user input.
 */
exports.validate = function validate(msg) {
  msg.logger.debug('Callback successful', {
    method: 'validate',
  });
  return Promise.resolve(msg);
};

/**
 * Lifecycle function name for authorizing the user to endpoint.
 * Define this only if you want to override the default behavior, which uses regular expressions
 * to authorize the call.
 */
exports.authorize = function authorize(msg) {
  msg.logger.debug('Callback successful', {
    method: 'authorize',
  });
  return Promise.resolve(msg);
};

/**
 * Lifecycle function name for pre-processing the request.
 */
exports.before = function before(msg) {
  msg.logger.debug('Callback successful', {
    method: 'before',
  });
  return Promise.resolve(msg);
};

/**
 * Lifecycle function name for processing the request.
 * This call must send a response to the client.  A response can be sent using any means that
 * express supports including template engines.  If a response is not sent, solos sends a 405 to
 * the client.
 */
exports.respond = function respond(msg) {
  msg.res.send('Solos Lives!!!');
  msg.logger.debug('Callback successful', {
    method: 'respond',
  });
  return Promise.resolve(msg);
};

/**
 * Lifecycle function name for post-processing and cleanup.
 * This is only called if 'respond' was called.
 */
exports.after = function after(msg) {
  msg.logger.debug('Callback successful', {
    method: 'after',
    context: msg,
  });
  return Promise.resolve(msg);
};