import { RawMessage } from "@minecraft/server";
import { BlockStateMap, IBlockTranslator, TransKey, TransType } from "./types";

const BlockTranslator: IBlockTranslator = {
    "wheat": {
        Type: TransType.Item,
        Override: "wheat_seeds",
        StateHandler: v => getGrowth(v, "growth", 7)
    },
    "cocoa": {
        Type: TransType.Item,
        Override: "dye.brown",
        StateHandler: v => getGrowth(v, "age", 2)
    },
    "reeds": {
        Type: TransType.Item,
        StateHandler: v => getGrowth(v, "age", 15)
    },
    "pumpkin_stem": {
        Type: TransType.Item,
        Override: "pumpkin_seeds",
        StateHandler: v => getGrowth(v, "growth", 7)
    },
    "melon_stem": {
        Type: TransType.Item,
        Override: "melon_seeds",
        StateHandler: v => getGrowth(v, "growth", 7)
    },
    "beetroot": {
        Type: TransType.Item,
        Override: "beetroot_seeds",
        StateHandler: v => getGrowth(v, "growth", 7)
    },
    "torchflower_crop": {
        Type: TransType.Item,
        Override: "torchflower_seeds",
        StateHandler: v => getGrowth(v, "growth", 7)
    },
    "pitcher_crop": {
        Type: TransType.Item,
        Override: "pitcher_pod",
        StateHandler: v => getGrowth(v, "growth", 4)
    },
    "stone": {
        StateHandler: ({ states }) => [`stone.${upperCaseWhenUnderscore(states.get("stone_type") as string)}`]
    },
    "monster_egg": {
        StateHandler: ({ states }) => {
            let s = (states.get("monster_egg_stone_type") as string).replace(/[\_]/g, "").replace("stone", "")
            return [`monster_egg${s ? "." + s : ""}`]
        }
    },
    "yellow_flower": {
        Override: "yellow_flower.dandelion",
    },
    "red_flower": {
        StateHandler: v => {
            let key = getState(v.states, "flower_type") as string
            switch (key) {
                case "orchid":
                    key = `blue_orchid`
                    break
                case "oxeye":
                    key = `oxeye_daisy`
                    break
            }
            return [`${v.lang.Name}.${upperCaseWhenUnderscore(key)}`]
        }
    },
    "double_plant": {
        StateHandler: v => {
            return [`${v.lang.Name}.${getState(v.states, "double_plant_type")}`]
        }
    },
    "*_log": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            switch (s[0]) {
                case "oak":
                case "spruce":
                case "birch":
                case "jungle":
                case "acacia":
                    return [`${s[1]}.${s[0]}`]
                case "dark":
                    return ["log.big_oak"]
                default:
                    return [v.lang.Name]
            }
        }
    },
    "leaves": {
        StateHandler: v => {
            return [`${v.lang.Name}.${getState(v.states, "old_leaf_type")}`]
        }
    },
    "leaves2": {
        StateHandler: v => {
            let s = getState(v.states, "new_leaf_type")
            return [`${v.lang.Name}.${s == "dark_oak" ? "big_oak" : s}`]
        }
    },
    "wood": {
        StateHandler: v => {
            let s = getState(v.states, "wood_type")
            let s2 = getState(v.states, "stripped_bit") as boolean
            return [`${v.lang.Name}.${s2 ? "stripped." : ""}${s}`]
        }
    },
    "planks": {
        StateHandler: v => {
            let s = getState(v.states, "wood_type")
            return [`${v.lang.Name}.${s == "dark_oak" ? "big_oak" : s}`]
        }
    },
    "wooden_slab": {
        Ref: "planks"
    },
    "wall_banner": {
        Override: "standing_banner"
    },
    "*_door": {
        Type: TransType.Item
    },
    "*_glazed_terracotta": {
        StateHandler: v => {
            let s = v.lang.Name.split("glazed_terracotta")
            return [`${upperCaseWhenUnderscore(`glazed_terracotta_${s[0].substring(0, s[0].length - 1)}`)}`]
        }
    },
    "cobblestone_wall": {
        StateHandler: v => {
            let s = getState(v.states, "wall_block_type") as string
            let s2 = s.split("_")
            if (s2.includes("cobblestone")) s2.pop()
            if (s2.length == 0) s2.push("normal")
            return [`${v.lang.Name}.${s2.join("_")}`]
        }
    },
    "powered_comparator": {
        Type: TransType.Item,
        Override: "comparator"
    },
    "comparator": {
        Type: TransType.Item
    },
    "sticky_piston_arm_collision": {
        Override: "sticky_piston"
    },
    "piston_arm_collision": {
        Override: "piston"
    },
    "oak_fence": {
        Override: "fence"
    },
    "spruce_fence": {
        Override: "spruceFence"
    },
    "birch_fence": {
        Override: "birchFence"
    },
    "jungle_fence": {
        Override: "jungleFence"
    },
    "acacia_fence": {
        Override: "acaciaFence"
    },
    "dark_oak_fence": {
        Override: "darkOakFence"
    },
    "*_fence_gate": {
        StateHandler: v => {
            return [`${upperCaseWhenUnderscore(v.lang.Name)}`]
        }
    },
    "*_stained_glass$": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            return [`${[s.pop(), s.pop()].reverse().join("_")}.${s.join("_")}`]
        }
    },
    "*_stained_glass_pane": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            return [`${[s.pop(), s.pop(), s.pop()].reverse().join("_")}.${s.join("_")}`]
        }
    },
    "stone_block_slab": {
        Override: "stone_slab",
        StateHandler: v => {
            let s = getState(v.states, "stone_slab_type") as string
            let s2 = s
            switch (s) {
                case "smooth_stone":
                    s2 = "stone"
                    break
                case "cobblestone":
                    s2 = "cobble"
                    break
                case "stone_brick":
                    s2 = "smoothStoneBrick"
                    break
                case "sandstone":
                    s2 = "sand"
                    break
            }
            return [`${v.lang.Name}.${s2}`]
        }
    },
    "stone_block_slab2": {
        Override: "stone_slab2",
        StateHandler: v => {
            let s = getState(v.states, "stone_slab_type_2") as string
            let s2 = s
            switch (s) {
                case "smooth_sandstone":
                    s2 = "sandstone.smooth"
                    break
                case "prismarine_rough":
                    s2 = "prismarine.rough"
                    break
                case "prismarine_dark":
                    s2 = "prismarine.dark"
                    break
                case "prismarine_brick":
                    s2 = "prismarine.bricks"
                    break
            }
            return [`${v.lang.Name}.${s2}`]
        }
    },
    "stone_block_slab3": {
        Override: "stone_slab3",
        StateHandler: v => {
            let s = getState(v.states, "stone_slab_type_3") as string
            let s2 = s
            switch (s) {
                case "smooth_red_sandstone":
                    s2 = "red_sandstone.smooth"
                    break
                case "polished_granite":
                    s2 = "granite.smooth"
                    break
                case "polished_andesite":
                    s2 = "andesite.smooth"
                    break
                case "polished_diorite":
                    s2 = "diorite.smooth"
                    break
                case "end_stone_brick":
                    s2 = "end_brick"
                    break
            }
            return [`${v.lang.Name}.${s2}`]
        }
    },
    "stone_block_slab4": {
        Override: "stone_slab4",
        StateHandler: v => {
            return [`${v.lang.Name}.${getState(v.states, "stone_slab_type_4")}`]
        }
    },
    "double_stone_block_slab": {
        Ref: "stone_block_slab"
    },
    "double_stone_block_slab2": {
        Ref: "stone_block_slab2"
    },
    "double_stone_block_slab3": {
        Ref: "stone_block_slab3"
    },
    "double_stone_block_slab4": {
        Ref: "stone_block_slab4"
    },
    "polished_blackstone_brick_double_slab": {
        Override: "polished_blackstone_brick_slab"
    },
    "stonebrick": {
        StateHandler: v => {
            return [`${v.lang.Name}.${getState(v.states, "stone_brick_type")}`]
        }
    },
    "prismarine": {
        StateHandler: v => {
            let s = getState(v.states, "prismarine_block_type")
            if (s == "default") s = "rough"
            return [`${v.lang.Name}.${s}`]
        }
    },
    "sandstone": {
        StateHandler: v => {
            let s = getState(v.states, "sand_stone_type")
            if (s == "heiroglyphs") s = "chiseled"
            return [`${v.lang.Name}.${s}`]
        }
    },
    "red_sandstone": {
        Ref: "sandstone"
    },
    "quartz_block": {
        StateHandler: v => {
            return [`${v.lang.Name}.${getState(v.states, "chisel_type")}`]
        }
    },
    "*_wool": {
        Ref: "*_concrete$"
    },
    "moss_carpet": {},
    "*_carpet": {
        Ref: "*_concrete$"
    },
    "*_concrete$": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            return [`${s.pop()}.${upperCaseWhenUnderscore(s.join("_"))}`]
        }
    },
    "*_concrete_powder": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            return [`${upperCaseWhenUnderscore([s.pop(), s.pop()].reverse().join("_"))}.${upperCaseWhenUnderscore(s.join("_"))}`]
        }
    },
    "*_terracotta": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            s.pop()
            return [`stained_hardened_clay.${upperCaseWhenUnderscore(s.join("_"))}`]
        }
    },
    "sapling": {
        StateHandler: v => {
            let s = getState(v.states, "sapling_type") as string
            if (s == "dark_oak") s = "big_oak"
            return [`${v.lang.Name}.${s}`]
        }
    },
    "tallgrass": {
        StateHandler: v => {
            let s = getState(v.states, "tall_grass_type") as string
            if (s == "tall") return [`${v.lang.Name}.grass`]
            return [`${v.lang.Name}.${s}`]
        }
    },
    "*_repeater": {
        Type: TransType.Item,
        Override: "repeater"
    },
    "*_comparator": {
        Type: TransType.Item,
        Override: "comparator"
    },
    "undyed_shulker_box": {
        Override: "shulker_box",
        StateHandler: v => {
            return [upperCaseWhenUnderscore(v.lang.Name)]
        }
    },
    "*_shulker_box": {
        StateHandler: v => {
            let s = v.lang.Name.split("_")
            if (s[1] == "gray") {
                s.shift()
                s[0] = "silver"
            }
            let s2 = [s.pop(), s.pop()].reverse()
            s2.push(s.join("_"))
            return [`${upperCaseWhenUnderscore(s2.join("_"))}`]
        }
    },
    "daylight_detector_inverted": {
        Override: "daylight_detector"
    },
    "purpur_block": {
        StateHandler: v => {
            let s = getState(v.states, "chisel_type")
            return [`${v.lang.Name}.${s}`]
        }
    },
    "sand": {
        StateHandler: v => {
            if (getState(v.states, "sand_type") == "red") return [`sand.red`]
            return []
        }
    },
    "coral_block": {
        StateHandler: v => {
            let s = getState(v.states, "coral_color")
            let s2 = getState(v.states, "dead_bit") as boolean
            if (s2) return [`${v.lang.Name}.${s}_dead`]
            return [`${v.lang.Name}.${s}`]
        }
    },
    "fire_coral": {
        Override: "coral.red"
    },
    "brain_coral": {
        Override: "coral.pink"
    },
    "bubble_coral": {
        Override: "coral.purple"
    },
    "tube_coral": {
        Override: "coral.blue"
    },
    "horn_coral": {
        Override: "coral.yellow"
    },
    "dead_fire_coral": {
        Override: "coral.red_dead"
    },
    "dead_brain_coral": {
        Override: "coral.pink_dead"
    },
    "dead_bubble_coral": {
        Override: "coral.purple_dead"
    },
    "dead_tube_coral": {
        Override: "coral.blue_dead"
    },
    "dead_horn_coral": {
        Override: "coral.yellow_dead"
    },
    "coral_fan_hang": {
        Override: "coral_fan",
        StateHandler: v => {
            let s = getState(v.states, "coral_hang_type_bit") as boolean
            let s2 = getState(v.states, "dead_bit") as boolean
            return [`${v.lang.Name}${s2 ? "_dead" : ""}.${s ? "pink" : "blue"}_fan`]
        }
    },
    "coral_fan_hang2": {
        Override: "coral_fan",
        StateHandler: v => {
            let s = getState(v.states, "coral_hang_type_bit") as boolean
            let s2 = getState(v.states, "dead_bit") as boolean
            return [`${v.lang.Name}${s2 ? "_dead" : ""}.${s ? "red" : "purple"}_fan`]
        }
    },
    "coral_fan_hang3": {
        Override: "coral_fan",
        StateHandler: v => {
            let s = getState(v.states, "coral_hang_type_bit") as boolean
            let s2 = getState(v.states, "dead_bit") as boolean
            return [`${v.lang.Name}${s2 ? "_dead" : ""}.${s ? "" : "yellow"}_fan`]
        }
    },
    "crimson_roots": {
        Override: "crimson_roots.crimsonRoots"
    },
    "warped_roots": {
        Override: "warped_roots.warpedRoots"
    },
    "seagrass": {
        Override: "seagrass.seagrass"
    },
    "skull": {
        Type: TransType.Item,
        Override: "skull.char"
    },
    "standing_sign": {
        Type: TransType.Item,
        Override: "sign"
    },
    "mangrove_standing_sign": {
        Type: TransType.Item,
        Override: "mangrove_sign"
    },
    "cherry_standing_sign": {
        Type: TransType.Item,
        Override: "cherry_sign"
    },
    "bamboo_standing_sign": {
        Type: TransType.Item,
        Override: "bamboo_sign"
    },
    "*_hanging_sign": {
        Type: TransType.Item
    },
    "lit_*": {
        StateHandler: v => {
            return [v.lang.Name.split("lit_")[1]]
        }
    },
    "anvil": {
        StateHandler: v => {
            let s = getState(v.states, "damage") as string
            return [`${v.lang.Name}${s == "undamaged" ? "" : "." + upperCaseWhenUnderscore(s)}`]
        }
    },
    "brewing_stand": {
        Type: TransType.Item
    },
    "sea_lantern": {
        Override: "seaLantern"
    },
    "frame": {
        Type: TransType.Item
    },
    "glow_frame": {
        Type: TransType.Item
    },
    "glower_pot": {
        Type: TransType.Item
    }
    // "bed": {
    //     Type: TransType.Item,
    //     ItemHandler: v => {
    //         return [([
    //             "bed.white"
    //         ])[v.items(["bed"])]]
    //     }
    // }
}

function getPercent(min: number, max: number, current: number): number {
    const difference = max - min;
    const percentage = (current - min) / difference * 100;
    return Math.round(percentage);
}

function getGrowth(
    { lang, states }: {
        lang: TransKey,
        states: BlockStateMap
    },
    block_state_name: string,
    min: number = 0,
    max?: number
): (string | RawMessage | undefined)[] {
    if (!max) {
        max = min
        min = 0
    }

    const current = states.get(block_state_name) as number ?? 0
    const growthPercentage = getPercent(min, max, current)

    const description = current < max ? {
        translate: `growth.description.0`,
        with: [`${growthPercentage}`]
    } : {
        translate: `growth.description.1`
    }

    return [undefined, description]
}

function getState(states_map: BlockStateMap, name: string) {
    return states_map.get(name)
}

function upperCaseWhenUnderscore(s: string): string {
    return s.replace(/_./g, (match) => match[1].toUpperCase())
}

export default BlockTranslator