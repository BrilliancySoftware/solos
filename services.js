/**
 * Copyright (c) 2018, Coder by Blood, Inc. All rights reserved.
 */

'use strict';

/**
 * @module services
 */

const me = /([/]([^/]+)[/])me([/])/g;
const end = /[.]solos[.]js$/;
const param = '$1:$2Id$3';
const d = require('debug');
const globby = require('globby');

const ns = 'solos:';
const log = {
  debug: {
    process: d(`${ns}process`),
    glob: d(`${ns}glob`),
  },
  trace: {
    process: d(`${ns}process:trace`),
    glob: d(`${ns}glob:trace`),
  },
};

/**
 * The configuration passed to globby module - see their docs:
 * - `{globs: ['**`&#8205;`/*.solos.js', '!node_modules/**`&#8205;`/*'], absolute: true}`
 *   the default is all solos.js files in subdirectories with absolute file names
 */
const defaultGlobConfig = {
  globs: ['**/*.solos.js', '!node_modules/**/*'],
  absolute: true,
};

const calls = ['remove', 'get', 'find', 'patch', 'create', 'update'];

/**
 * Returns the debug log for the service call
 *
 * @param {string} call **required** [remove|get|find|patch|create|update]
 * @return {object} the debug loggers:
 * - `debug:` with namespace 'solos:{service}' - for debugging
 * - `trace:` with namespace 'solos:{service}:trace' - for tracing function calls
 */
function getLog(call) {
  log[call] = log[call] || {
    debug: d(`${ns}${call}`),
    trace: d(`${ns}${call}:trace`),
  };

  return log[call];
}

// const defaultProcessConfig = {}; //not needed yet

/**
 * Translates the full path to a file into a relative path with route parameters
 * by stripping off the base and replacing 'me' directors with parameters.
 *
 * /path/to/strip/path/to/me/file/endpoint.solos.js <-- file
 * /path/to/strip <-- base
 * /path/to/:toId/file/endpoint <-- return
 *
 * @param {string} file **required** The full path to the file
 * @param {string} base **required** The full path of the base to strip from the file
 *
 * @return {string} relative path with route parameters
 */
function toPath(file, base) {
  // two regex passes are required because regexes do not match replaced content
  log.trace.process({ enter: 'toPath', args: { file, base } });
  return file.replace(base, '').replace(me, param).replace(me, param).replace(end, '');
}

module.exports = {
  /**
   * Process the files in subdirectories and registers them as featherjs
   * services with before and after callback hooks.
   *
   * #### The required configuration is: ####
   * 1. NONE
   *
   * #### The optional configuration is: ####
   * 1. NONE
   *
   * @param {array} files **required** Full paths to files holding solos services
   * if files.base is set, it is passed to `toPath(...)` otherwise default to
   * current working directory
   * @param {object} config **optional** The configuration
   * @param {function} toModule **optional** `function(path)` that returns a
   * service - defaults to `require`
   * @param {function} toURI **optional** `function(filepath, basepath)` that
   * returns a URI endpoint for the service - defaults to `toPath`
   */
  process(files, config, toModule = require, toURI = toPath) {
    log.trace.process({ enter: 'process', args: { files, config, toModule, toURI } });
    // const conf = Object.assign({}, defaultProcessConfig, config); //not needed yet
    const services = [];

    files.forEach((file) => {
      const solos = toModule(file);
      const uri = toURI(file, files.base || process.cwd());
      const endpoint = { path: uri, solos };

      calls.forEach((call) => {
        const impl = solos[call];
        if (impl && typeof impl === 'function') {
          solos[call] = async function doCall(...args) {
            args.push(getLog(call));

            return impl.apply(impl.this, args);
          };
        }
      });

      log.debug.process(endpoint);
      services.push(endpoint);
    });

    return services;
  },

  /**
   * Finds all solos.js files in subdirectories
   *
   * #### The required configuration is: ####
   * 1. NONE
   *
   * #### The optional configuration is: ####
   * 1. `{globs: ['**`&#8205;`/*.solos.js', '!node_modules/**`&#8205;`/*'], absolute: true}`
   *    the default is all solos.js files in subdirectories with absolute file names
   *
   * @param {object} directory **required** The root directory to scan for files
   * @param {object} config **optional** The configuration passed to
   * deified module - see their docs:
   */
  async glob(directory, config) {
    log.trace.glob({ enter: 'glob', args: { directory, config } });

    const conf = Object.assign({}, defaultGlobConfig, config);
    conf.cwd = directory;
    log.debug.glob({ conf });

    return globby(conf.globs, conf);
  },
};
