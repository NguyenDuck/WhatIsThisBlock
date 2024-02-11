import * as esbuild from 'esbuild'
import * as fs from 'fs'
import { join, resolve } from 'path'
import env from 'esbuild-plugin-env'

let argv = process.argv
const tsnodeRoot = argv.shift()
const thisFilePath = argv.shift()

let parsedArgs: string[] = []
let parsedArgsValue: { [key: string]: string } = {}

function readArg() {
	let arg = argv.shift()!
	if (arg.startsWith('--')) {
		let argName = arg.slice(2)
		parsedArgs.push(argName)
		let argValue = argv[1]
		// if (!argValue) throw new Error(`Missing value for argument ${argName}`)
		// if (argValue.startsWith('-')) throw new Error(`Missing value for argument ${argName}`)
		parsedArgsValue[argName] = argValue
		return argName
	} else {
		parsedArgs.push(arg)
		return arg
	}
}

function readAllArgs() {
	while (argv.length > 0) {
		readArg()
	}
}

readAllArgs()

// console.log(parsedArgs, parsedArgsValue)

const funcManager = new Map<
	string,
	SingleLongFunc | ValueLongFunc | SingleShortFunc | ValueShortFunc
>()

type LongFunctionRef = string
// --name
type SingleLongFunc = () => void
// --name value
type ValueLongFunc = (arg: string) => void
// -n
type SingleShortFunc = () => void | LongFunctionRef
// -n value
type ValueShortFunc = (arg: string) => void | LongFunctionRef

if (parsedArgs.includes('build')) {
	esbuild.build({
		plugins: [env()],
		bundle: true,
		entryPoints: ['BP/scripts/main.ts'],
		outfile: 'BP/scripts/main.js',
		// outdir: 'BP/scripts',
		banner: {
			js:
				`/**\n` +
				`   ::::    :::  ::::::::  :::    ::: :::   ::: :::::::::: ::::    ::: :::::::::  :::    :::  ::::::::  :::    :::\n` +
				`   :+:+:   :+: :+:    :+: :+:    :+: :+:   :+: :+:        :+:+:   :+: :+:    :+: :+:    :+: :+:    :+: :+:   :+: \n` +
				`   :+:+:+  +:+ +:+        +:+    +:+  +:+ +:+  +:+        :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+        +:+  +:+  \n` +
				`   +#+ +:+ +#+ :#:        +#+    +:+   +#++:   +#++:++#   +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#+        +#++:++   \n` +
				`   +#+  +#+#+# +#+   +#+# +#+    +#+    +#+    +#+        +#+  +#+#+# +#+    +#+ +#+    +#+ +#+        +#+  +#+  \n` +
				`   #+#   #+#+# #+#    #+# #+#    #+#    #+#    #+#        #+#   #+#+# #+#    #+# #+#    #+# #+#    #+# #+#   #+# \n` +
				`   ###    ####  ########   ########     ###    ########## ###    #### #########   ########   ########  ###    ###\n` +
				`*/\n`,
		},
		minify: true,
		platform: 'neutral',
		external: ['@minecraft/server'],
		mangleProps: new RegExp('^_.+$'),
	})
}

if (parsedArgs.includes('export')) {
	const devBev = 'development_behavior_packs'
	const devRes = 'development_resource_packs'

	function writeToAppData(filename: string) {
		const appDataPath = process.env.LOCALAPPDATA!
		const comMojang = join(
			appDataPath,
			'Packages',
			'Microsoft.MinecraftUWP_8wekyb3d8bbwe',
			'LocalState',
			'games',
			'com.mojang'
		)

		fs.rmSync(join(comMojang, devBev, filename), {
			recursive: true,
			force: true,
		})
		fs.rmSync(join(comMojang, devRes, filename), {
			recursive: true,
			force: true,
		})

		fs.cpSync('BP', join(comMojang, devBev, filename), {
			recursive: true,
			dereference: true,
			preserveTimestamps: true,
			filter: (src, dest) => {
				if (src.endsWith('.ts')) return false
				return true
			},
		})

		fs.cpSync('RP', join(comMojang, devRes, filename), {
			recursive: true,
		})
	}

	writeToAppData('WITB')
}
