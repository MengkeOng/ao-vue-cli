#!/usr/bin/env node

var ejs = require('ejs')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var program = require('commander')
var readline = require('readline')
var sortedObject = require('sorted-object')
var util = require('util')

var MODE_0666 = parseInt('0666', 8)
var MODE_0755 = parseInt('0755', 8)

var _exit = process.exit
var pkg = require('../package.json')

var version = pkg.version
var from = path.join(__dirname, '..', 'templates');

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit

// CLI

around(program, 'optionMissingArgument', function (fn, args) {
  program.outputHelp()
  fn.apply(this, args)
  return { args: [], unknown: [] }
})

before(program, 'outputHelp', function () {
  // track if help was shown for unknown option
  this._helpShown = true
})

before(program, 'unknownOption', function () {
  // allow unknown options if help was shown, to prevent trailing error
  this._allowUnknownOption = this._helpShown

  // show help if not yet shown
  if (!this._helpShown) {
    program.outputHelp()
  }
})

program
  .version(version, '    --version')
  .usage('[options] [dir]')
  .parse(process.argv)

if (!exit.exited) {
  main()
}

/**
 * Install an around function; AOP.
 */

function around (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) args[i] = arguments[i]
    return fn.call(this, old, args)
  }
}

/**
 * Install a before function; AOP.
 */

function before (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    fn.call(this)
    old.apply(this, arguments)
  }
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm (msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}

/**
 * Copy file from template directory.
 */

function copyTemplate (from, to) {
  from = path.join(__dirname, '..', 'templates', from)
  write(to, fs.readFileSync(from, 'utf-8'))
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication (name, path) {
  var wait = 5

  console.log()
  function complete () {
    if (--wait) return
    var prompt = launchedFromCmd() ? '>' : '$'

    console.log()
    console.log('   install dependencies:')
    console.log('     %s cd %s && npm install', prompt, path)
    console.log()
    console.log('   run the app:')

    if (launchedFromCmd()) {
      console.log('     %s SET DEBUG=%s:* & npm start', prompt, name)
    } else {
      console.log('     %s DEBUG=%s:* npm start', prompt, name)
    }

    console.log()
  }

  mkdir(path, function () {
    travel(from, function(file){
        var files = file.split('templates')
        var to = files[1].split('/');
        to.pop();
      mkdir(path + to.join('/'), function(){
        write(path + files[1], fs.readFileSync(file, 'utf-8'))
      })
    })
   
    // package.json
    var pkg = {
      name: name,
      version: '0.0.0',
      description: name,
      license: "MIT",
      private: true,
      keywords: [
        "admin",
        "bulma",
        "dashboard",
        "data",
        "visualization",
        "vue"
      ],
      engines: {
        "node": ">=4",
        "npm": ">=3"
      },
      scripts: {
        "build": "cross-env NODE_ENV=production node build/build.js",
        "build:testing": "cross-env NODE_ENV=testing node build/build-testing.js",
        "clean": "rm -rf dist",
        "dev": "cross-env NODE_ENV=development node build/dev-server.js",
        "electron": "cross-env NODE_ELECTRON=true npm run build && electron electronIndex.js",
        "gh": "npm run build && gh-pages -d dist",
        "test": "echo lol"
      },
      dependencies: {
        "animate.css": "3.5.2",
        "animejs": "^2.0.1",
        "axios": "^0.15.3",
        "bulma": "^0.5.1",
        "click-confirm": "^1.1.0",
        "font-awesome": "4.7.0",
        "mdi": "^1.8.36",
        "plotly.js": "^1.24.2",
        "vee-validate": "^2.0.0-rc.14",
        "vue": "^2.2.2",
        "vue-axios": "^2.0.1",
        "vue-bulma-brace": "^0.1.0",
        "vue-bulma-breadcrumb": "^1.0.1",
        "vue-bulma-card": "^1.0.2",
        "vue-bulma-chartist": "^1.1.0",
        "vue-bulma-chartjs": "^1.0.4",
        "vue-bulma-collapse": "1.0.3",
        "vue-bulma-datepicker": "^1.3.0",
        "vue-bulma-emoji": "^0.0.2",
        "vue-bulma-expanding": "^0.0.1",
        "vue-bulma-jump": "^0.0.2",
        "vue-bulma-message": "^1.1.1",
        "vue-bulma-modal": "1.0.1",
        "vue-bulma-notification": "^1.1.1",
        "vue-bulma-progress-bar": "^1.0.2",
        "vue-bulma-progress-tracker": "0.0.4",
        "vue-bulma-quill": "0.0.1",
        "vue-bulma-rating": "^1.0.1",
        "vue-bulma-slider": "^1.0.2",
        "vue-bulma-switch": "^1.0.4",
        "vue-bulma-tabs": "^1.1.2",
        "vue-bulma-tooltip": "^1.0.3",
        "vue-cleave": "1.1.1",
        "vue-lory": "0.0.4",
        "vue-moment": "^2.0.2",
        "vue-nprogress": "0.1.5",
        "vue-peity": "0.5.0",
        "vue-router": "^2.3.0",
        "vue-toasted": "^1.1.15",
        "vuex": "^2.2.1",
        "vuex-router-sync": "^4.1.2",
        "wysiwyg.css": "0.0.2"
      },
      devDependencies: {
        "autoprefixer": "^6.7.7",
        "babel-core": "^6.21.0",
        "babel-loader": "^6.4.0",
        "babel-plugin-transform-export-extensions": "^6.8.0",
        "babel-preset-es2015": "^6.14.0",
        "babel-preset-stage-2": "^6.17.0",
        "connect-history-api-fallback": "^1.3.0",
        "cross-env": "^3.1.3",
        "css-loader": "^0.27.1",
        "electron-devtools-installer": "^2.0.1",
        "eventsource-polyfill": "^0.9.6",
        "express": "^4.15.2",
        "extract-text-webpack-plugin": "^2.0.0-beta.4",
        "file-loader": "^0.10.1",
        "html-webpack-plugin": "^2.25.0",
        "http-proxy-middleware": "^0.17.4",
        "imports-loader": "^0.7.0",
        "node-sass": "^4.1.1",
        "opn": "^4.0.2",
        "ora": "^1.1.0",
        "postcss-loader": "^1.3.3",
        "progress-bar-webpack-plugin": "^1.9.1",
        "sass-loader": "^6.0.3",
        "serve-favicon": "^2.4.1",
        "shelljs": "^0.7.8",
        "style-loader": "^0.13.1",
        "stylus": "^0.54.5",
        "stylus-loader": "^3.0.1",
        "url-loader": "^0.5.7",
        "vue-html-loader": "^1.2.3",
        "vue-loader": "^11.1.4",
        "vue-template-compiler": "^2.2.2",
        "webpack": "^2.2.1",
        "webpack-dev-middleware": "^1.9.0",
        "webpack-hot-middleware": "^2.14.0",
        "webpack-merge": "^4.0.0"
      }
    }
    // sort dependencies like npm(1)
    pkg.dependencies = sortedObject(pkg.dependencies)

    // write files
    write(path + '/package.json', JSON.stringify(pkg, null, 2) + '\n')
    complete()
  })
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName (pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory (path, fn) {
  fs.readdir(path, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

/**
 * Graceful exit for async STDIO
 */

function exit (code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done () {
    if (!(draining--)) _exit(code)
  }

  var draining = 0
  var streams = [process.stdout, process.stderr]

  exit.exited = true

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd () {
  return process.platform === 'win32' &&
    process.env._ === undefined
}

/**
 * Load template file.
 */

function loadTemplate (name) {
  var contents = fs.readFileSync(path.join(__dirname, '..', 'templates', (name + '.ejs')), 'utf-8')
  var locals = Object.create(null)

  function render () {
    return ejs.render(contents, locals)
  }

  return {
    locals: locals,
    render: render
  }
}

/**
 * Main program.
 */

function main () {
  var destinationPath = program.args.shift() || '.'

  // App name
  var appName = createAppName(path.resolve(destinationPath)) || 'hello-world'

  // Generate application
  emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      createApplication(appName, destinationPath)
    } else {
      confirm('destination is not empty, continue? [y/N] ', function (ok) {
        if (ok) {
          process.stdin.destroy()
          createApplication(appName, destinationPath)
        } else {
          console.error('aborting')
          exit(1)
        }
      })
    }
  })
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir (path, fn) {
  mkdirp(path, MODE_0755, function (err) {
    if (err) throw err
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
    fn && fn()
  })
}

/**
 * Generate a callback function for commander to warn about renamed option.
 *
 * @param {String} originalName
 * @param {String} newName
 */

function renamedOption (originalName, newName) {
  return function (val) {
    warning(util.format("option `%s' has been renamed to `%s'", originalName, newName))
    return val
  }
}

/**
 * Display a warning similar to how errors are displayed by commander.
 *
 * @param {String} message
 */

function warning (message) {
  console.error()
  message.split('\n').forEach(function (line) {
    console.error('  warning: %s', line)
  })
  console.error()
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write (path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}

function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}