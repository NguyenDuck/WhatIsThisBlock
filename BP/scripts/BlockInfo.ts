import { Block, BlockPermutation, BlockType, BlockTypes, Container, EntityInventoryComponent, ItemLockMode, ItemStack, Player, Vector3, system } from "@minecraft/server";
import BlockTranslator from "./BlockTranslator";
import BlockBase from "./BlockBase";
import { BlockTransEntry, StateHandler, TransKey, TransType } from "./types";
import BlockNameDisplayer from "./BlockNameDisplayer";
import BlockDescDisplayer from "./BlockDescDisplayer";
import { isPermutationEquals, toBlockStateMap } from "./utils";
import Settings from "./Settings";

export default class BlockInfo {
    private playerInv: EntityInventoryComponent
    private lastTranslator: BlockTransEntry | undefined
    private _lastKeyTranslator: string
    private block: BlockBase
    private langKey: TransKey
    private readonly displayer: {
        name: BlockNameDisplayer
        desc: BlockDescDisplayer
    }

    private lastBlock: {
        Type: BlockType | undefined,
        Location: Vector3 | undefined,
        Permutation: BlockPermutation | undefined,
    }

    constructor(protected player: Player) {
        this.displayer = {
            name: new BlockNameDisplayer(player),
            desc: new BlockDescDisplayer(player)
        }
        this.lastBlock = {
            Type: BlockTypes.get("air"),
            Location: undefined,
            Permutation: undefined
        }
    }

    public send(block?: Block): void {
        if (!block) return this.handleNonBlock()
        if (Settings.debugMode) this.logCurrentBlock(block)

        this.block = new BlockBase(block)

        this.langKey = new TransKey(TransType.Block, this.block.isVanilla ? this.block.name : this.block.type.id)
        this.displayer.desc.setNamespace(this.block.namespace)

        const translator = this.getTranslator()

        if (translator) this.handleTranslator(translator)
        else {
            this.displayer.name.setName(this.langKey)
            if (this.displayer.name.isChanged()) {
                let old_item = this.item
                const new_item = this.block.getItemStack()
                new_item.lockMode = ItemLockMode.slot
                new_item.setLore(["witb locked"])
                system.runTimeout(() => this.displayer.name.send(), 0)
                this.item = new_item
                if (!this.displayer.desc.isEmpty()) system.runTimeout(() => this.displayer.desc.forceRemoveDescription(), 1)
                system.runTimeout(() => this.item = old_item, 2)
            }
            if (this.displayer.desc.isChanged()) {
                system.runTimeout(() => this.displayer.desc.send(), 1)
            }
        }
        this.lastBlock = {
            Type: this.block.type,
            Location: this.block.location,
            Permutation: this.block.permutation
        }
    }

    private logCurrentBlock(block: Block) {
        this.player.onScreenDisplay.setActionBar(
            "§a" + block.type.id +
            (() => {
                let states = block.permutation.getAllStates()
                return Object.getOwnPropertyNames(states).length ? ("\n§6" + JSON.stringify(states, (k, v) => {
                    if (typeof v == "string") return `§g${v}§6`
                    if (typeof v == "number") return `§b${v}§6`
                    if (typeof v == "boolean") return `§d${v}§6`
                    return v
                }, "*")) : ""
            })().replace(/"|,|\*/g, "").replace(/(^\{\n|\{|\}|\}\n$)/g, "") +
            `\n§cTranslator: §9${this.getKeyTranslator()}`
        )
    }

    private handleNonBlock() {
        if (this.lastBlock.Type) {
            this.lastBlock = {
                Type: undefined,
                Location: undefined,
                Permutation: undefined
            }
            this.lastTranslator = undefined
            this.displayer.name.removeName()
            this.displayer.desc.removeDescription()
        }
    }

    private handleTranslator(trans: BlockTransEntry) {
        if (trans.Type) {
            this.langKey.Prefix = trans.Type
            // if (trans.ItemHandler) {
            //     return this.handleItem(trans.ItemHandler)
            // }
        }
        if (trans.Override) this.langKey.Name = trans.Override
        if (trans.StateHandler) this.handleState(trans.StateHandler)
        else {
            this.displayer.name.setName(this.langKey)
            if (this.displayer.name.isChanged()) {
                let old_item = this.item
                const new_item = this.block.getItemStack()
                new_item.lockMode = ItemLockMode.slot
                new_item.setLore(["witb locked"])
                system.runTimeout(() => this.displayer.name.send(), 0)
                this.item = new_item
                if (!this.displayer.desc.isEmpty()) system.runTimeout(() => this.displayer.desc.forceRemoveDescription(), 1)
                system.runTimeout(() => this.item = old_item, 2)
            }
            if (this.displayer.desc.isChanged()) {
                system.runTimeout(() => this.displayer.desc.send(), 1)
            }
        }
    }

    // private handleItem(callback: ItemHandler) {
    //     let item = this.block.getItemStack()
    //     callback({
    //         lang: this.langKey,
    //         items: (items_data: string[]) => {
    //             for (let i = 0; i < items_data.length; i++) {
    //                 if (item.isStackableWith(new ItemStack(items_data[i]))) {
    //                     return i
    //                 }
    //             }
    //             return undefined
    //         }
    //     })
    // }

    private handleState(callback: StateHandler) {
        const perm = this.block.permutation
        if (this.lastBlock.Permutation && isPermutationEquals(this.lastBlock.Permutation, perm)) return
        const states_map = toBlockStateMap(perm)
        const [name, desc] = callback({ lang: this.langKey, states: states_map })
        if (name) this.langKey.Name = name.toString()

        if (desc) {
            this.displayer.desc.setDescription(desc)
        } else {
            this.displayer.desc.removeDescription()
        }

        this.displayer.name.setName(this.langKey)

        if (this.displayer.name.isChanged()) {
            let old_item = this.item
            const new_item = this.block.getItemStack()
            new_item.lockMode = ItemLockMode.slot
            new_item.setLore(["witb locked"])
            system.runTimeout(() => this.displayer.name.send(), 0)
            this.item = new_item
            system.runTimeout(() => this.item = old_item, 2)
        }

        if (this.displayer.desc.isChanged()) {
            system.runTimeout(() => this.displayer.desc.send(), 1)
        }
    }

    private get item(): ItemStack | undefined {
        return this.getPlayerContainer().getSlot(17).getItem()
    }

    private set item(item: ItemStack | undefined) {
        try {
            throw new Error()
        } catch (e) { console.log("BlockInfo", e.stack) }
        this.getPlayerContainer().setItem(17, item)
    }

    private getPlayerContainer(): Container {
        if (!this.playerInv) this.playerInv = this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent
        return this.playerInv.container
    }

    private getKeyTranslator(): string {
        return this._lastKeyTranslator
    }

    private getTranslator() {
        const lang = this.block.name
        let trans = BlockTranslator[lang]
        this._lastKeyTranslator = lang
        if (trans && trans.Ref) {
            trans = BlockTranslator[trans.Ref]
            this._lastKeyTranslator = trans.Ref
        }
        if (!trans) {
            for (const key in BlockTranslator) {
                let pattern = key.replace("*", "[a-z]+")
                if (pattern === key) continue
                pattern = `(${pattern})`
                if (lang.match(pattern)) {
                    trans = BlockTranslator[key]
                    if (Settings.debugMode) console.log("GetTranslator", JSON.stringify(trans))
                    this._lastKeyTranslator = key
                    if (trans && trans.Ref) {
                        this._lastKeyTranslator = trans.Ref
                        trans = BlockTranslator[trans.Ref]
                    }
                    break
                }
            }
        }
        this.lastTranslator = trans
        return this.lastTranslator
    }
}