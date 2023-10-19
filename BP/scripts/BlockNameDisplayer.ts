import { Container, EntityInventoryComponent, ItemStack } from "@minecraft/server";
import NameDisplayer from "./NameDisplayer";
import { TransKey, TransType } from "./types";

export default class BlockNameDisplayer extends NameDisplayer {
    private container: Container

    private getPlayerInv(): Container {
        if (!this.container) this.container = (this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container
        return this.container
    }

    private getPlayerItem(): ItemStack | undefined {
        return this.getPlayerInv().getItem(17)
    }

    private setPlayerItem(item: ItemStack | undefined) {
        return this.getPlayerInv().setItem(17, item)
    }
}