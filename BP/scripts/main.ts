import { world, system } from '@minecraft/server';
import BlockInfo from './BlockInfo';

const debugMode = true

const range = { maxDistance: 7.2 }
world.afterEvents.playerSpawn.subscribe(({ player }) => {
    const block_info = new BlockInfo(player)
    const n = system.runInterval(() => {
        if (!player.isValid()) return system.clearRun(n)

        const block = player.getBlockFromViewDirection(range)?.block
        try {
            block_info.send(block)
        }
        catch (e) {
            debugMode ? world.sendMessage(`${e} ${e.stack}`) : null
        }
    }, 3)
})