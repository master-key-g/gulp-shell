# gulp-shell

![Coveralls](https://img.shields.io/coverallsCoverage/github/master-key-g/gulp-shell?branch=main&style=plastic&logo=coveralls&color=%233F5767)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=plastic)](https://github.com/prettier/prettier)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/master-key-g/gulp-shell?style=plastic)
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmaster-key-g%2Fgulp-shell%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.name&style=plastic)
![GitHub Tag](https://img.shields.io/github/v/tag/master-key-g/gulp-shell?style=plastic)

> A handy command line interface for gulp

## Installation

```shell
npm install --save-dev @master-key-g/gulp-shell
```

## Usage

```js
const gulp = require('gulp')
const shell = require('gulp-shell')

gulp.task('example', () => {
  return gulp
    .src('*.js', { read: false })
    .pipe(shell(['echo <%= file.path %>']))
})
```

Or you can use this shorthand:

```js
gulp.task('greet', shell.task('echo Hello, World!'))
```

**WARNING**: Running commands like ~~`gulp.src('').pipe(shell('whatever'))`~~ is [considered as an anti-pattern](https://github.com/master-key-g/gulp-shell/issues/55). **PLEASE DON'T DO THAT ANYMORE**.

## API

### shell(commands, options) or shell.task(commands, options)

#### commands

type: `string` or `Array<string>`

A command can be a [template][] which can be interpolated by some [file][] info (e.g. `file.path`).

**WARNING**: [Using command templates can be extremely dangerous](https://github.com/master-key-g/gulp-shell/issues/83). Don't shoot yourself in the foot by ~~passing arguments like `$(rm -rf $HOME)`~~.

#### options.cwd

type: `string`

default: [`process.cwd()`](http://nodejs.org/api/process.html#process_process_cwd)

Sets the current working directory for the command. This can be a [template][] which can be interpolated by some [file][] info (e.g. `file.path`).

#### options.env

type: `object`

By default, all the commands will be executed in an environment with all the variables in [`process.env`](http://nodejs.org/api/process.html#process_process_env) and `PATH` prepended by `./node_modules/.bin` (allowing you to run executables in your Node's dependencies).

You can override any environment variables with this option.

For example, setting it to `{ PATH: process.env.PATH }` will reset the `PATH` if the default one brings your some troubles.

#### options.shell

type: `string`

default: `/bin/sh` on UNIX, and `cmd.exe` on Windows

Change it to `bash` if you like.

#### options.quiet

type: `boolean`

default: `false`

By default, it will print the command output.

#### options.verbose

type: `boolean`

default: `false`

Set to `true` to print the command(s) to stdout as they are executed

#### options.ignoreErrors

type: `boolean`

default: `false`

By default, it will emit an `error` event when the command finishes unsuccessfully.

#### options.errorMessage

type: `string`

default: `` Command `<%= command %>` failed with exit code <%= error.code %> ``

You can add a custom error message for when the command fails.
This can be a [template][] which can be interpolated with the current `command`, some [file][] info (e.g. `file.path`) and some error info (e.g. `error.code`).

#### options.templateData

type: `object`

The data that can be accessed in [template][].

[template]: http://lodash.com/docs#template
[file]: https://github.com/wearefractal/vinyl
