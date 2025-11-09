import chalk from 'chalk';
import { spawn } from 'child_process';
import fancyLog from 'fancy-log';
import * as path from 'path';
import PluginError from 'plugin-error';
import { obj as throughObj } from 'through2';
import Vinyl from 'vinyl';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const template = require('lodash.template-async');







const PLUGIN_NAME = 'Gulp-Shell'

interface Options {
	cwd?: string
	env?: NodeJS.ProcessEnv
	shell?: true | string
	quiet?: boolean
	verbose?: boolean
	ignoreErrors?: boolean
	errorMessage?: string
	templateData?: object
}

const normalizeCommands = (commands: string | string[]): string[] => {
	if (typeof commands === 'string') {
		commands = [commands]
	}

	if (!Array.isArray(commands)) {
		throw new PluginError(PLUGIN_NAME, 'Missing commands')
	}

	return commands
}

const normalizeOptions = (options: Options = {}): Required<Options> => {
	const pathToBin = path.join(process.cwd(), 'node_modules', '.bin')
	/* istanbul ignore next */
	const pathName = process.platform === 'win32' ? 'Path' : 'PATH'
	// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	const newPath = pathToBin + path.delimiter + process.env[pathName]
	const env = {
		...process.env,
		[pathName]: newPath,
		...options.env
	}

	return {
		cwd: process.cwd(),
		env,
		shell: true,
		quiet: false,
		verbose: false,
		ignoreErrors: false,
		errorMessage:
			'Command `<%= command %>` failed with exit code <%= error.code %>',
		templateData: {},
		...options
	}
}

const runCommand = (
	command: string,
	options: Required<Options>,
	file: Vinyl | null
): Promise<void> => {
	const context = { file, ...options.templateData }
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	command = template(command)(context)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const cwd = template(options.cwd)(context);
	if (options.verbose) {
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		fancyLog(`${PLUGIN_NAME}:`, chalk.cyan(cwd + "$ " + command))
	}

	const child = spawn(command, {
		env: options.env,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		cwd: cwd,
		shell: options.shell,
		stdio: options.quiet ? 'ignore' : 'inherit'
	})

	return new Promise((resolve, reject) => {
		child.on('exit', code => {
			if (code === 0 || options.ignoreErrors) {
				resolve(); return;
			}

			const context = {
				command,
				file,
				error: { code },
				...options.templateData
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const message = template(options.errorMessage)(context)

			// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
			reject(new PluginError(PLUGIN_NAME, message))
		})
	})
}

const runCommands = async (
	commands: string[],
	options: Required<Options>,
	file: Vinyl | null
): Promise<void> => {
	for (const command of commands) {
		await runCommand(command, options, file)
	}
}

const shell = (
	commands: string | string[],
	options?: Options
): NodeJS.ReadWriteStream => {
	const normalizedCommands = normalizeCommands(commands)
	const normalizedOptions = normalizeOptions(options)

	const stream = throughObj(function (file, _encoding, done) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		runCommands(normalizedCommands, normalizedOptions, file)
			.then(() => {
				this.push(file)
			})
			.catch((error: unknown) => {
				this.emit('error', error)
			})
			.finally(done)
	})

	stream.resume()

	return stream
}

shell.task = (commands: string | string[], options?: Options) => (): Promise<
	void
> => runCommands(normalizeCommands(commands), normalizeOptions(options), null)

export = shell
