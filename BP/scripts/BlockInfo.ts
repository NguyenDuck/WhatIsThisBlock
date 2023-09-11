import { Block, BlockPermutation, BlockType, EntityInventoryComponent, ItemStack, MinecraftBlockTypes, Player, RawMessage, Vector3, system } from "@minecraft/server";
import BlockTranslator, { BlockTranslatorEntry, IBlockTranslator } from "./BlockTranslator";
import BlockBase from "./BlockBase";
import Queue from "./Queue";

let old_block: {
    Type: BlockType,
    Location: Vector3,
    Permutation: BlockPermutation,
    HasStateCallback: boolean,
    Display: {
        Name: DisplayEntry,
        Description: DisplayEntry
    }
}

export declare type Message = string | RawMessage | (string | RawMessage)[]
export declare type BlockStateMap = Map<string, string | number | boolean>
export declare type BlockStateHandlerParams = {
    readonly name: (v: RawMessage) => void,
    readonly desc: (v: RawMessage) => void,
    readonly states: BlockStateMap
}
export declare type BlockStateHandler = (p: BlockStateHandlerParams) => void
export declare enum BlockTranslateType {
    Block,
    Item,
    Entity
}
export class DisplayEntry {
    constructor(public Type: "name" | "description", public Value: string | RawMessage) { }
}

function sendTitle(player: Player, title: Message, subtitle?: Message): void {
    player.onScreenDisplay.setTitle(title, {
        fadeInDuration: 0,
        fadeOutDuration: 0,
        stayDuration: 0,
        subtitle: subtitle
    })
}

const run = system.runInterval

export default class BlockInfo {

    private player: Player
    private playerInventory: EntityInventoryComponent
    private block: BlockBase
    private _translator: BlockTranslatorEntry
    private queue = new Queue<DisplayEntry>()

    constructor(player: Player, block: Block) {
        this.player = player
        this.block = new BlockBase(block)
        this.playerInventory = this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent
    }

    public static sendEmpty(player: Player): void {
        if (old_block.Type == MinecraftBlockTypes.air) return
        old_block.Type = MinecraftBlockTypes.air
        sendTitle(player, `|witb_block_view_disabled|`)
    }

    public send(): void {
        if (old_block.Type == this.block.type) {
            if (old_block.HasStateCallback) {
                const perm = this.block.permutation
                const states = perm.getAllStates()
                let state_map = new Map<string, string | number | boolean>()
                for (let state in states) state_map.set(state, states[state])
                const trans = this.translator

                trans.BlockStates!({
                    name: (v: string | RawMessage) => this.queue.enqueue(new DisplayEntry("name", v)),
                    desc: (v: string | RawMessage) => this.queue.enqueue(new DisplayEntry("description", v)),
                    states: state_map,
                })
            }
        } else {
            old_block.Type = this.block.type
            let current_item = this.playerInventoryItem
            let new_item = this.block.getItemStack()
            this.playerInventoryItem = new_item
            this.queue.enqueue(new DisplayEntry("name", this.getTranslationKey()))
            const perm = this.block.permutation
            const states = perm.getAllStates()
            let state_map = new Map<string, string | number | boolean>()
            for (const state in states) state_map.set(state, states[state])
            const trans = this.translator

            trans.BlockStates!({
                name: (v: string | RawMessage) => this.queue.enqueue(new DisplayEntry("name", v)),
                desc: (v:string|RawMessage) => this.queue.enqueue(new DisplayEntry("description", v)),
                states: state_map,
            })

            run(() => {this.playerInventoryItem = current_item}, 2)
        }

        while (!this.queue.isEmpty()) {
            let entry = this.queue.dequeue()!
            switch (entry.Type) {
                case "name":
                    if (old_block.Display.Name && old_block.Display.Name == entry) continue
                    run(() => sendTitle(this.player, `|witb_changed_icon|`, [`|witb_block_name|`, entry.Value]), this.queue.size() - 1)
                    old_block.Display.Name = entry
                    break
                case "description":
                    if (old_block.Display.Description && old_block.Display.Description == entry) continue
                    run(() => sendTitle(this.player, [`|witb_block_namespace|`, this.block.namespace], entry.Value), this.queue.size() - 1)
                    old_block.Display.Name = entry
                    break
            }
        }
    }

    private get playerInventoryItem(): ItemStack | undefined {
        return this.playerInventory.container.getSlot(17).getItem()
    }

    private set playerInventoryItem(item: ItemStack | undefined) {
        this.playerInventory.container.setItem(17, item)
    }

    private getKey(name: string, type?: BlockTranslateType): string {
        switch (type) {
            case BlockTranslateType.Item:
            case BlockTranslateType.Entity:
                return `${type.toString().toLowerCase()}.${name}.name`
            default:
                return `tile.${name}.name`
        }
    }

    private get translator() {
        if (!this._translator) {
            let lang = this.block.name
            let trans = BlockTranslator[lang]
            if (trans && trans.Ref) trans = BlockTranslator[trans.Ref]
            if (!trans) {
                for (const key in BlockTranslator) {
                    let pattern = key.replace("*", "[a-z]+")
                    if (pattern == key) continue
                    pattern = `(${pattern})`
                    if (lang.match(pattern)) trans = BlockTranslator[key]
                }
            }
            this._translator = trans
        }
        return this._translator
    }

    private getTranslationKey(): string {
        let lang = this.block.name
        const trans = this.translator
        if (!trans) return this.getKey(lang)
        if (trans.Override) return this.getKey(trans.Override, trans.Type)
        return this.getKey(lang, trans.Type)
    }
}