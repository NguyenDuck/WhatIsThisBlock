import { RawMessage } from "@minecraft/server";

export type Message = string | RawMessage | (string | RawMessage)[]
export type BlockStateMap = Map<string, string | number | boolean>
export enum TransType {
    Block = "tile",
    Item = "item",
    Entity = "entity",
}
export class TransKey {
    constructor(
        public Prefix: TransType,
        public Name: string
    ) {}
    toString(): string {
        return `${this.Prefix}.${this.Name}.name`
    }

    toRawMessage(_) {
        return {
            translate: this.toString()
        } as RawMessage
    }

    public equals(other: TransKey): boolean {
        return this.Prefix === other.Prefix && this.Name === other.Name
    }
}
export type StateHandler = ({lang, states}: {
    lang: TransKey
    states: BlockStateMap
}) => (string | RawMessage | undefined)[]
// export type ItemHandler = ({lang, items}: {
//     lang: TransKey
//     items: (items_data: string[]) => number | undefined
// }) => (string | RawMessage | undefined)[]
export type BlockTransEntry = {
    Type?: TransType
    Override?: string
    StateHandler?: StateHandler
    // ItemHandler?: ItemHandler
    Ref?: string
}
export interface IBlockTranslator {
    [key: string]: BlockTransEntry
}