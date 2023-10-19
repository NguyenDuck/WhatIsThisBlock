import { world, system } from '@minecraft/server';
import BlockInfo from './BlockInfo';
import Settings from './Settings';

const range = { maxDistance: 7.3 }
world.afterEvents.playerSpawn.subscribe(({ player }) => {
    const block_info = new BlockInfo(player)
    const n = system.runInterval(() => {
        if (!player.isValid()) return system.clearRun(n)

        const block = player.getBlockFromViewDirection(range)?.block
        const entity = player.getEntitiesFromViewDirection(range)
        entity.forEach(e => player.onScreenDisplay.setActionBar(e.entity.id))
        try {
            block_info.send(block)
        }
        catch (e) {
            Settings.debugMode ? world.sendMessage(`${e} ${e.stack}`) : null
        }
    }, 3)
})