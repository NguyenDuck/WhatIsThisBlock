import { Block, BlockPermutation, BlockType, ItemStack, Vector3 } from "@minecraft/server";


export default class BlockBase {

    private _split: string[]
    private _namespace: string
    private _name: string

    constructor(private block: Block) {
        this._split = block.typeId.split(":")
        this._namespace = this._split[0]
        this._name = this._split[1]
    }

    public get type(): BlockType {
        return this.block.type
    }

    public get permutation(): BlockPermutation {
        return this.block.permutation
    }

    public get location(): Vector3 {
        return this.block.location
    }

    public get tags(): string[] {
        return this.block.getTags()
    }

    public getItemStack(): ItemStack {
        return this.block.getItemStack()
    }


    public get name(): string {
        return this._name
    }

    public get namespace(): string {
        return this._namespace
    }

    public get isVanilla(): boolean {
        return this._namespace == "minecraft"
    }
}