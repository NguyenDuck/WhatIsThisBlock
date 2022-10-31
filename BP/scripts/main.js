import {
    world,
    Location,
    Player,
    Block,
    Entity,
    PlayerIterator,
    EntityHealthComponent
} from '@minecraft/server'

const blockTranslator = {
    "carrots": {
        "renameTo": "carrot"
    },
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
        "renameByNBTValue": "flower_type"
    },
    "red_flower": {
        "renameByNBTValue": "flower_type",
        "upperCaseWhenUnderscore": true
    },
    "double_plant": {
        "renameByNBTValue": "double_plant_type"
    },
    "log": {
        "renameByNBTValue": "old_log_type"
    },
    "log2": {
        "renameByNBTValue": "new_log_type",
        "renameTo": "log",
        "NBTValueCondition": [
            {
                "name": "new_log_type",
                "value": "dark_oak",
                "renameNBTValue": "big_oak"
            }

        ]
    },
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
        "isInvalid": true,
        "function": "monster_egg_stone"
    },
    "infested_deepslate": {
        "isInvalid": true
    },
    "sticky_piston_arm_collision": {
        "renameTo": "sticky_piston"
    },
    "piston_arm_collision": {
        "renameTo": "piston"
    }
}

const debugMode = true
const entry = "%%s\n"

world.events.tick.subscribe(_t => {
    let iterator = world.getPlayers()
    WITB(iterator)
})

const witb = {
    font_size: {
        large: "witb.font_size.large",
        small: "witb.font_size.small"
    }
}

world.events.beforeChat.subscribe(async c => {
    let player = c.sender
    let m = c.message
    let curPos = 0
    if (m.startsWith("witb")) {
        curPos += 5
        if (m.startsWith("font_size", curPos)) {
            curPos += 10
            if (m.startsWith("small", curPos)) {
                player.removeTag(witb.font_size.large)
                player.addTag(witb.font_size.small)
            } else if (m.startsWith("large", curPos)) {
                player.removeTag(witb.font_size.small)
                player.addTag(witb.font_size.large)
            } else {
                player.removeTag(witb.font_size.small)
                player.removeTag(witb.font_size.large)
            }
            c.cancel = true
        }
    }
})

/**
* @param { PlayerIterator } iterator
*/
async function WITB(iterator) {
    try {
        for (let player of iterator) {
            const playerHeadLoc = player.headLocation
            let block = player.getBlockFromViewVector()
            let entities = player.getEntitiesFromViewVector()
            if (entities === null) continue
            if (block === null) continue
            let blockLoc = block.location
            let blockR = getRadius(playerHeadLoc, blockLoc)
            let mode = "block"
            let entity
            for (let i in entities) {
                let e = entities[i]
                if (blockR > getRadius(playerHeadLoc, e.location)) {
                    mode = "entity"
                    entity = e
                }
            }
            if (mode == "block") {
                blockInfo(player, block)
            } else if (entity) {
                entityInfo(player, entity)
            }

        }
    } catch (er) {
        if (debugMode) console.log(`${er}`)
    }
}

/**
* @param {Player} player
* @param {Block} block
*/
async function blockInfo(player, block) {
    if (!player.headLocation.isNear(new Location(block.location.x, block.location.y, block.location.z), 5.8)) return
    let langKey = removeNamespace(block.type.id, true)
    let prefixNamespace = removeNamespace(block.type.id, false)
    let isVanillaBlock = prefixNamespace == "minecraft"
    let bT = blockTranslator[langKey]
    if (bT && bT.ref) bT = blockTranslator[bT.ref]
    if (bT === undefined) {
        for (let i in blockTranslator) {
            let p = i.replace("*", "[a-z]+")
            p = `(${p})`
            if (langKey.match(p) !== null) {
                bT = blockTranslator[i]
                break
            }
        }
    }
    let checkNBTCondition = false
    let callFunction = null
    let renameNBTKey = ""
    let lang_prefix = "tile"
    let is_invalid = false
    if (isVanillaBlock && bT) {
        if (bT.isInvalid) is_invalid = true
        switch (bT.thisIs) {
            case "item":
            case "entity":
                lang_prefix = bT.thisIs
        }
        if (bT.renameTo) langKey = bT.renameTo
        if (bT.renameByNBTValue) renameNBTKey = bT.renameByNBTValue
        if (bT.NBTValueCondition) checkNBTCondition = true
        if (bT.function) callFunction = bT.function
    }
    let isCompatible = player.hasTag(prefixNamespace)
    let fontSize = ""
    if (player.hasTag(witb.font_size.small)) fontSize = "§kfss"
    if (player.hasTag(witb.font_size.large)) fontSize = "§kfsl"
    let blockStates = ""
    let blockStates2 = new CustomArray()
    let isFluid = false
    let fluidName = ""
    let fluidCalculationUnit1 = "mB"
    let fluidCalculationUnit2 = "B"
    let fluidPercent = 0
    let fluidCapacity = ""
    let fluidType = ""
    if (isVanillaBlock || isCompatible) {
        let propertyList = new Array()
        let valueList = new Array()
        block.permutation.getAllProperties().forEach((v) => {
            if (!propertyList.includes(v.name)) {
                propertyList.push(v.name)
                valueList.push(v.value)
            }
        })
        propertyList.forEach((v, i) => {
            let n = removeNamespace(v, true)
            let val = valueList[i]
            if (checkNBTCondition) {
                let p = bT.NBTValueCondition
                for (let con in p) {
                    let o = p[con]
                    if (o.name == n && o.value == val) {
                        if (o.renameNBTValue) {
                            val = o.renameNBTValue
                        } else if (o.renameNBTName) {
                            n = o.renameNBTName
                        }
                    }
                }
            }
            if (callFunction) {
                switch (callFunction) {
                    case "glazed_terracotta":
                        langKey = glazed_terracotta(langKey)
                        break
                    case "wall":
                        if (n == "wall_block_type") {
                            langKey = wall(langKey, val)
                            return
                        }
                        break
                    case "monster_egg_stone":
                        if (n == "monster_egg_stone_type") {
                            langKey = monster_egg_stone(langKey, val)
                            return
                        }
                        break
                }
            }
            if (n.startsWith("wall_connection_type")) return
            if (renameNBTKey && n == renameNBTKey) {
                if (bT.upperCaseWhenUnderscore) {
                    langKey += "." + replaceUnderscoreAndUppercase(val)
                } else {
                    langKey += "." + val
                }
                return
            } else if (bT && bT.upperCaseWhenUnderscore) {
                langKey = replaceUnderscoreAndUppercase(langKey)
            }
            if (n == "cauldron_liquid") {
                isFluid = true
                fluidType = "§kfluid_type:" + val + "_"
                let temp = val.split("")
                temp[0] = temp[0].toUpperCase()
                fluidName = temp.join("")
                return
            }
            if (isFluid && n == "fill_level") {
                fluidPercent = getPercent(val, 6)
                if (fluidPercent == 0) {
                    fluidCapacity += Math.floor(fluidPercent) + " " + fluidCalculationUnit1
                } else {
                    fluidCapacity += Math.floor(fluidPercent * 10) + " " + fluidCalculationUnit1
                }
                if (val == 0) fluidName = fluidType = ""
                fluidCapacity += "§kfluid_percent:" + Math.floor(fluidPercent) + "_"
                return
            }
            blockStates += entry
            blockStates2.push(`${n}: ${val}`)
        })
    }
    let rT1 = []
    let jsonObj = {
        "rawtext": rT1
    }
    rT1.push({
        "translate": is_invalid ? "" : "§kprefix",
        "with": []
    })
    rT1[0].translate += `${is_invalid ? "" : fontSize}` + entry
    rT1[0].translate += (isVanillaBlock || isCompatible) && blockStates ? entry : "\n"
    rT1[0].translate += isFluid ? "§kis_fluid" + fluidType + "§o" + fluidCapacity + " " + fluidName + "\n\n" : ""
    rT1[0].translate += `§l§9${isVanillaBlock ? "Minecraft" : "%%s"}${is_invalid ? "" : "\n§r§o§eWhatIsThisBlock"}`
    rT1[0]["with"].push({
        "rawtext": [{
            "translate": `${lang_prefix}.${isVanillaBlock ? langKey : prefixNamespace + ":" + langKey}.name`
        }]
    })
    if ((isVanillaBlock || isCompatible) && blockStates) {
        rT1[0]["with"].push({
            "rawtext": [{
                "translate": blockStates,
                "with": blockStates2
            }]
        })
    }
    if (!isVanillaBlock) {
        rT1[0]["with"].push({
            "rawtext": [{
                "translate": prefixNamespace
            }]
        })
    }
    let cmd = `titleraw ${player.name} actionbar ${JSON.stringify(jsonObj)}`
    debugMode ? console.log(cmd) : null
    player.runCommandAsync(cmd).catch(e => debugMode ? console.log(`${e}`) : null)
}

/**
* @param {Player} player
* @param {Entity} entity
*/
async function entityInfo(player, entity) {
    let langKey = removeNamespace(entity.typeId, true)
    let prefixNamespace = removeNamespace(entity.typeId, false)
    let isVanillaEntity = prefixNamespace == "minecraft"
    let heart_a = 0
    let v = entity.getComponent("minecraft:health")
    if (v instanceof EntityHealthComponent) {
        heart_a = v.current
    }

    let testText = ""
    if (heart_a > 100) testText += " "
    if (heart_a > 1000) testText += " "
    if (heart_a > 10000) testText += " "

    player.runCommandAsync(`titleraw ${player.name} actionbar {"rawtext": [{"translate": "entity.${langKey}.name"}, {"translate": "\n§kisentity§kh_a?${heart_a > 20 ? "?" + "x" + Math.floor(heart_a * 10) / 10 + testText : Math.floor(heart_a) + "?"}"}, {"translate": "\n\n§r§l§9${isVanillaEntity ? "Minecraft" : "%%s"}"}, {"translate": "\n§r§o§eWhatIsThisBlock"}]}`)
}

/**
* @param { String } langKey
*/
function glazed_terracotta(langKey) {
    let l = langKey.split("_")
    if (l.length == 4) {
        l = [`${l[0]}_${l[1]}`, l[2], l[3]]
    }
    return replaceUnderscoreAndUppercase([l[1], "_", l[2]].join("")) + "." + l[0]
}

/**
* @param { String } langKey
* @param { String } nbt
*/
function wall(langKey, nbt) {
    let r = nbt
    switch (nbt) {
        case "mossy_cobblestone":
            r = "mossy"
            break
        case "cobblestone":
            r = "normal"
            break
    }
    return `${langKey}.${r}`
}

/**
* @param {String} langKey
* @param {String} nbt
*/
function monster_egg_stone(langKey, nbt) {
    let r = nbt.replaceAll("stone", "").replaceAll("_", "")
    return `${langKey}${r ? "." : ""}${r}`
}

/**
* @param {Location} pos1
* @param {Location} pos2
* @return {Number} radius between two 3D location
*/
function getRadius(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2) + Math.pow(pos2.z - pos1.z, 2))
}

export class CustomArray extends Array {
    constructor() {
        super()
    }

    toString() {
        if (!this.length) return "[]"
        let s = "["
        this.forEach((v, i) => {
            s += `${i == 0 ? "" : ","}"${v.toString()}"`
        })
        s += "]"
        return s
    }
}

/**
* @param { String } namespace
* @param { Boolean } rmMC
*/
function removeNamespace(namespace, rmMC) {
    let splited = namespace.split(":")
    if (splited.length == 2) {
        if (splited[0] === "minecraft" && rmMC) return splited[1]
        if (!rmMC) return splited[0]
        return splited[1]
    }
    return namespace
}

/**
* @param { Number } current
* @param { Number } max
* @param { Number } min
* @param { Number } distance
*/
function getPercent(current, max, min, distance) {
    if (distance && min) return (current / 100 * (((max - min) / distance + 1) * 100))
    if (min) return (current / 100 * ((max - min) * 100))
    return (current / max * 100)
}

/**
* @param { String } s
*/
function replaceUnderscoreAndUppercase(s) {
    let sl = s.split("")
    let newS = ""
    let cur = false
    for (let c in sl) {
        if (sl[c] == "_") {
            cur = true
            continue
        }
        if (cur) {
            cur = false
            newS += sl[c].toUpperCase()
        } else {
            newS += sl[c]
        }
    }
    return newS
}