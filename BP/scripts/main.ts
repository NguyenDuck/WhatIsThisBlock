import { world, system } from '@minecraft/server';
import BlockInfo from './BlockInfo';

const debugMode = true

const range = { maxDistance: 7 }
world.afterEvents.playerSpawn.subscribe(({ player }) => {
    const n = system.runInterval(() => {
        if (!player.isValid()) system.clearRun(n)

        const block = player.getBlockFromViewDirection(range)?.block
        try {
            if (!block) {
                BlockInfo.sendEmpty(player)
            } else {
                new BlockInfo(player, block).send()
            }
        }
        catch (e) {
            debugMode ? world.sendMessage(`${e} ${e.stack}`) : null
        }
    }, 3)
})