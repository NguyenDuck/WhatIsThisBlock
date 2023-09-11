import { RawMessage } from "@minecraft/server"
import { BlockStateHandler, BlockStateHandlerParams, BlockTranslateType, Message } from "./BlockInfo";

function getPercent(min: number, max: number, current: number): number {
    const difference = max - min;
    const percentage = (current - min) / difference * 100;
    return Math.round(percentage);
}

function getGrowth(
    p: BlockStateHandlerParams,
    block_state_name: string,
    min: number = 0,
    max?: number
): void {
    if (!max) {
        max = min
        min = 0
    }

    const current = p.states.get(block_state_name) as number ?? 0
    const growthPercentage = getPercent(min, max, current)

    const description = current < max ? {
        translate: `growth.description.0`,
        with: [`${growthPercentage}`]
    } : {
        translate: `growth.description.1`
    }

    p.desc(description)
}

export declare type BlockTranslatorEntry = {
    Type?: BlockTranslateType,
    Override?: string,
    BlockStates?: BlockStateHandler,
    Ref?: string
}
export declare interface IBlockTranslator {
    [key: string]: BlockTranslatorEntry
}

const BlockTranslator: IBlockTranslator = {
    "wheat": {
        Type: BlockTranslateType.Item,
        Override: "wheat_seeds",
        BlockStates: v => getGrowth(v, "growth", 7)
    },
    "cocoa": {
        Type: BlockTranslateType.Item,
        Override: "dye.brown",
        BlockStates: v => getGrowth(v, "age", 2)
    },
    "reeds": {
        Type: BlockTranslateType.Item,
        BlockStates: v => getGrowth(v, "age", 15)
    },
}

export default BlockTranslator