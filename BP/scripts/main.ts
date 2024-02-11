import { world, system } from '@minecraft/server'
import BlockInfo from './BlockInfo'
import Settings from './Settings'

world.afterEvents.playerSpawn.subscribe(({ player }) => {
	const block_info = new BlockInfo(player)
	const n = system.runInterval(() => {
		if (!player.isValid()) return system.clearRun(n)

		const block = player.getBlockFromViewDirection(Settings.range)?.block
		try {
			block_info.send(block)
		} catch (e) {
			Settings.debugMode ? console.warn(e, e.stack) : null
		}
	}, Settings.poseInterval)
})
