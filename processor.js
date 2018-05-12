/**
 * Copyright (c) 2016, Coder by Blood, Inc. All rights reserved.
 */

'use strict';

module.exports = function process(/* unused options parameter */) {
  const seneca = this;

  this.add({
    role: 'solos',
    cmd: 'require',
  }, (msg, respond) => {
    let error;

    if (!error && !msg.module) {
      try {
        /* eslint-disable global-require, import/no-dynamic-require */
        msg.module = require(msg.path);
        /* eslint-enable */
      } catch (err) {
        error = err;
      }
    }

    respond(error, msg);
  });

  this.add({
    role: 'solos',
    cmd: 'process',
    target: 'entity',
  }, (msg, respond) => {
    seneca.act({
      role: 'solos',
      cmd: 'require',
    }, msg, (err, message) => {
      if (err) {
        respond(err, message);
      } else {
        seneca.act({
          role: 'solos',
          cmd: 'bind',
        }, message, respond);
      }
    });
  });

  this.add({
    role: 'solos',
    cmd: 'process',
    target: 'method',
  }, (msg, respond) => {
    seneca.act({
      role: 'solos',
      cmd: 'require',
    }, msg, (err, message) => {
      if (err) {
        respond(err, message);
      } else {
        seneca.act({
          role: 'solos',
          cmd: 'bind',
        }, message, respond);
      }
    });
  });
};
