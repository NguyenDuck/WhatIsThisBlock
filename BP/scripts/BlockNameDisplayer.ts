import { Container, EntityInventoryComponent, ItemStack } from "@minecraft/server";
import { Displayer } from "./Displayer";
import { TransKey, TransType } from "./types";

/**
 * A subclass of the `Displayer` abstract class that displays the name of a block in game.
 * 
 * @extends Displayer
 */
export default class BlockNameDisplayer extends Displayer {

    private block_name: TransKey

    private container: Container

    private _isChanged = false

    /**
     * Displays the block name as a title with an optional subtitle.
     * 
     * @param name - The block name to be displayed.
     * @param subtitle - The optional subtitle to be displayed.
     */
    public send(): void {
        if (!this._isChanged) return
        this.sendTitle(`|witb_changed_icon|`, [`|witb_block_name|`, this.block_name.toString()])
        this._isChanged = false
    }

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

    /**
     * Retrieves the current block name.
     * 
     * @returns The current block name.
     */
    public getName(): TransKey {
        return this.block_name
    }

    /**
     * Sets the block name.
     * 
     * @param name - The block name to be set.
     */
    public setName(name: TransKey) {
        if (this.block_name && this.block_name.equals(name)) return
        this.block_name = name
        this._isChanged = true
    }

    /**
     * Displays a default message indicating that the block view is disabled.
     */
    public removeName() {
        this.setName(new TransKey(TransType.Block, ""))
        this.sendTitle(`|witb_block_view_disabled|`)
        this._isChanged = false
    }

    public isChanged(): boolean { return this._isChanged }
}