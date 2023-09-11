const block_translator = {
    "wheat": {
        "thisIs": "item",
        "renameTo": "wheat_seeds"
    },
    "cocoa": {
        "thisIs": "item",
        "renameTo": "dye.brown"
    },
    "reeds": {
        "thisIs": "item"
    },
    "lava_cauldron": {
        "renameTo": "cauldron"
    },
    "stone": {
        "renameByNBTValue": "stone_type"
    },
    "yellow_flower": {
        "renameTo": "yellow_flower.dandelion"
    },
    "red_flower": {
        "renameByNBTValue": "flower_type",
        "NBTValueCondition": [
            {
                "name": "flower_type",
                "value": "orchid",
                "renameNBTValue": "blue_orchid"
            },
            {
                "name": "flower_type",
                "value": "oxeye",
                "renameNBTValue": "oxeye_daisy"
            },
            {
                "name": "flower_type",
                "upperCase": "_"
            }
        ]
    },
    "double_plant": {
        "renameByNBTValue": "double_plant_type"
    },
    "*_log": {
        "function": "log"
    },
    // "log2": {
    //     "renameByNBTValue": "new_log_type",
    //     "renameTo": "log",
    //     "NBTValueCondition": [
    //         {
    //             "name": "new_log_type",
    //             "value": "dark_oak",
    //             "renameNBTValue": "big_oak"
    //         }
    //     ]
    // },
    "leaves": {
        "renameByNBTValue": "old_leaf_type"
    },
    "leaves2": {
        "renameByNBTValue": "new_leaf_type",
        "NBTValueCondition": [
            {
                "name": "new_leaf_type",
                "value": "dark_oak",
                "renameNBTValue": "big_oak"
            }
        ]
    },
    "wood": {
        "renameByNBTValue": "wood_type"
    },
    "planks": {
        "renameByNBTValue": "wood_type",
        "NBTValueCondition": [
            {
                "name": "wood_type",
                "value": "dark_oak",
                "renameNBTValue": "big_oak"
            }
        ]
    },
    "wooden_slab": {
        "ref": "planks"
    },
    "melon_stem": {
        "thisIs": "item",
        "renameTo": "melon_seeds"
    },
    "pumpkin_stem": {
        "thisIs": "item",
        "renameTo": "pumpkin_seeds"
    },
    "wall_banner": {
        "renameTo": "standing_banner"
    },
    "*_door": {
        "thisIs": "item"
    },
    "*_glazed_terracotta": {
        "function": "glazed_terracotta"
    },
    "cobblestone_wall": {
        "function": "wall"
    },
    "powered_comparator": {
        "thisIs": "item",
        "renameTo": "comparator"
    },
    "comparator": {
        "thisIs": "item"
    },
    "monster_egg": {
        "function": "monster_egg_stone"
    },
    "sticky_piston_arm_collision": {
        "renameTo": "sticky_piston"
    },
    "piston_arm_collision": {
        "renameTo": "piston"
    },
    // "*_fence": {
    //     "renameByNBTValue": "wood_type",
    //     // "swapOnDot": true,
    //     "upperCaseWhenUnderscore": true,
    //     // "upperCaseWhenDot": true,
    //     "NBTValueCondition": [
    //         {
    //             "name": "wood_type",
    //             "value": "oak",
    //             "breakcurrent": true
    //         }
    //     ]
    // },
    "*fence_gate": {
        "upperCaseWhenUnderscore": false
    },
    "stained_glass": {
        "renameByNBTValue": "color"
    },
    "stained_glass_pane": {
        "ref": "stained_glass"
    },
    "stone_block_slab": {
        "renameTo": "stone_slab",
        "renameByNBTValue": "stone_slab_type",
        "NBTValueCondition": [
            {
                "name": "stone_slab_type",
                "value": "smooth_stone",
                "renameNBTValue": "stone"
            },
            {
                "name": "stone_slab_type",
                "value": "cobblestone",
                "renameNBTValue": "cobble"
            },
            {
                "name": "stone_slab_type",
                "value": "stone_brick",
                "renameNBTValue": "smoothStoneBrick"
            },
            {
                "name": "stone_slab_type",
                "value": "sandstone",
                "renameNBTValue": "sand"
            }
        ]
    },
    "stone_block_slab2": {
        "renameTo": "stone_slab2",
        "renameByNBTValue": "stone_slab_type_2",
        "NBTValueCondition": [
            {
                "name": "stone_slab_type_2",
                "value": "smooth_sandstone",
                "renameNBTValue": "sandstone.smooth"
            },
            {
                "name": "stone_slab_type_2",
                "value": "prismarine_rough",
                "renameNBTValue": "prismarine.rough"
            },
            {
                "name": "stone_slab_type_2",
                "value": "prismarine_dark",
                "renameNBTValue": "prismarine.dark"
            },
            {
                "name": "stone_slab_type_2",
                "value": "prismarine_brick",
                "renameNBTValue": "prismarine.bricks"
            }
        ]
    },
    "stone_block_slab3": {
        "renameTo": "stone_slab3",
        "renameByNBTValue": "stone_slab_type_3",
        "NBTValueCondition": [
            {
                "name": "stone_slab_type_3",
                "value": "smooth_red_sandstone",
                "renameNBTValue": "red_sandstone.smooth"
            },
            {
                "name": "stone_slab_type_3",
                "value": "polished_granite",
                "renameNBTValue": "granite.smooth"
            },
            {
                "name": "stone_slab_type_3",
                "value": "polished_andesite",
                "renameNBTValue": "andesite.smooth"
            },
            {
                "name": "stone_slab_type_3",
                "value": "polished_diorite",
                "renameNBTValue": "diorite.smooth"
            },
            {
                "name": "stone_slab_type_3",
                "value": "end_stone_brick",
                "renameNBTValue": "end_brick"
            }
        ]
    },
    "stone_block_slab4": {
        "renameTo": "stone_slab4",
        "renameByNBTValue": "stone_slab_type_4"
    },
    "double_stone_block_slab": {
        "ref": "stone_block_slab"
    },
    "double_stone_block_slab2": {
        "ref": "stone_block_slab2"
    },
    "double_stone_block_slab3": {
        "ref": "stone_block_slab3"
    },
    "double_stone_block_slab4": {
        "ref": "stone_block_slab4"
    },
    "polished_blackstone_brick_double_slab": {
        "renameTo": "polished_blackstone_brick_slab"
    },
    "stonebrick": {
        "renameByNBTValue": "stone_brick_type"
    },
    "prismarine": {
        "renameByNBTValue": "prismarine_block_type",
        "NBTValueCondition": [
            {
                "name": "prismarine_block_type",
                "value": "default",
                "renameNBTValue": "rough"
            }
        ]
    },
    "sandstone": {
        "renameByNBTValue": "sand_stone_type",
        "NBTValueCondition": [
            {
                "name": "sand_stone_type",
                "value": "heiroglyphs",
                "renameNBTValue": "chiseled"
            }
        ]
    },
    "red_sandstone": {
        "renameByNBTValue": "sand_stone_type",
        "NBTValueCondition": [
            {
                "name": "sand_stone_type",
                "value": "heiroglyphs",
                "renameNBTValue": "chiseled"
            }
        ]
    },
    "quartz_block": {
        "renameByNBTValue": "chisel_type"
    },
    "wool": {
        "ref": "stained_glass"
    },
    "carpet": {
        "ref": "stained_glass"
    },
    "concrete": {
        "forceUpperCaseWhenUnderscore": true,
        "renameByNBTValue": "color"
    },
    "concrete_powder": {
        "ref": "concrete"
    },
    "stained_hardened_clay": {
        "renameByNBTValue": "color"
    },
    "sapling": {
        "renameByNBTValue": "sapling_type",
        "NBTValueCondition": [
            {
                "name": "sapling_type",
                "value": "dark_oak",
                "renameNBTValue": "big_oak"
            }
        ]
    },
    "tallgrass": {
        "renameByNBTValue": "tall_grass_type",
        "NBTValueCondition": [
            {
                "name": "tall_grass_type",
                "value": "tall",
                "breakcurrent": true,
                "renameTo": "grass"
            }
        ]
    },
    "*_repeater": {
        "thisIs": "item",
        "renameTo": "repeater"
    },
    "*_comparator": {
        "thisIs": "item",
        "renameTo": "comparator"
    },
    "undyed_shulker_box": {
        "renameTo": "shulker_box",
        "upperCaseWhenUnderscore": true
    },
    "shulker_box": {
        "renameByNBTValue": "color",
        "upperCaseWhenDot": true,
        "forceUpperCaseWhenUnderscore": true
    },
    "daylight_detector_inverted": {
        "renameTo": "daylight_detector"
    },
    "purpur_block": {
        "renameByNBTValue": "chisel_type"
    },
    "sand": {
        "NBTValueCondition": [
            {
                "name": "sand_type",
                "value": "red",
                "renameTo": "sand.red"
            }
        ]
    },
    "coral": {
        "renameByNBTValue": "coral_color",
        "NBTValueCondition": [
            {
                "name": "dead_bit",
                "value": true,
                "appendToSuffix": "_dead"
            }
        ]
    },
    "coral_fan": {
        "renameByNBTValue": "coral_color",
        "NBTValueCondition": [
            {
                "name": "coral_fan_direction",
                "appendToSuffix": "_fan"
            }
        ]
    },
    "coral_fan_dead": {
        "ref": "coral_fan"
    },
    "coral_fan_hang": {
        "renameTo": "coral_fan",
        "renameByNBTValue": "coral_hang_type_bit",
        "NBTValueCondition": [
            {
                "name": "coral_hang_type_bit",
                "value": true,
                "renameNBTValue": "pink_fan"
            },
            {
                "name": "coral_hang_type_bit",
                "value": false,
                "renameNBTValue": "blue_fan"
            },
            {
                "name": "dead_bit",
                "value": true,
                "renameTo": "coral_fan_dead"
            }
        ]
    },
    "coral_fan_hang2": {
        "renameTo": "coral_fan",
        "renameByNBTValue": "coral_hang_type_bit",
        "NBTValueCondition": [
            {
                "name": "coral_hang_type_bit",
                "value": true,
                "renameNBTValue": "red_fan"
            },
            {
                "name": "coral_hang_type_bit",
                "value": false,
                "renameNBTValue": "purple_fan"
            },
            {
                "name": "dead_bit",
                "value": true,
                "renameTo": "coral_fan_dead"
            }
        ]
    },
    "coral_fan_hang3": {
        "renameTo": "coral_fan",
        "renameByNBTValue": "coral_hang_type_bit",
        "NBTValueCondition": [
            {
                "name": "coral_hang_type_bit",
                "value": false,
                "renameNBTValue": "yellow_fan"
            },
            {
                "name": "dead_bit",
                "value": true,
                "renameTo": "coral_fan_dead"
            }
        ]
    },
    "crimson_roots": {
        "renameTo": "crimson_roots.crimsonRoots"
    },
    "warped_roots": {
        "renameTo": "warped_roots.warpedRoots"
    },
    "seagrass": {
        "renameTo": "seagrass.seagrass"
    },
    "coral_block": {
        "ref": "coral"
    },
    "skull": {
        "thisIs": "item",
        "renameTo": "skull.char"
    },
    "standing_sign": {
        "thisIs": "item",
        "renameTo": "sign"
    },
    "lit_furnace": {
        "renameTo": "furnace"
    },
    "lit_blast_furnace": {
        "renameTo": "blast_furnace"
    },
    "lit_smoker": {
        "renameTo": "smoker"
    },
    "lit_redstone_lamp": {
        "renameTo": "redstone_lamp"
    },
    "anvil": {
        "renameByNBTValue": "damage",
        "upperCaseWhenUnderscore": true,
        "forceUpperCaseWhenUnderscore": true,
        "NBTValueCondition": [
            {
                "name": "damage",
                "value": "undamaged",
                "breakcurrent": true,
                "renameTo": "anvil"
            }
        ]
    },
    "brewing_stand": {
        "thisIs": "item"
    },
    "sea_lantern": {
        "upperCaseWhenUnderscore": true
    },
    "frame": {
        "thisIs": "item"
    },
    "glow_frame": {
        "thisIs": "item"
    },
    "flower_pot": {
        "thisIs": "item"
    },
    "beetroot": {
        "thisIs": "item",
        "renameTo": "beetroot_seeds"
    },
    "*_wool": {
        "function": "wool"
    },
    "bed": {
        "function": "bed"
    }
}

export default block_translator