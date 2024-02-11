import { RawMessage } from '@minecraft/server'
import { IBlockTranslator, StateHandlerParams, TransType } from './types'

const BlockTranslator: IBlockTranslator = {
	'wheat': {
		Type: TransType.Item,
		Override: 'wheat_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'cocoa': {
		Type: TransType.Item,
		Override: 'dye.brown',
		StateHandler: v => getGrowth(v, 'age', 2),
	},
	'reeds': {
		Type: TransType.Item,
		StateHandler: v => getGrowth(v, 'age', 15),
	},
	'pumpkin_stem': {
		Type: TransType.Item,
		Override: 'pumpkin_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'melon_stem': {
		Type: TransType.Item,
		Override: 'melon_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'beetroot': {
		Type: TransType.Item,
		Override: 'beetroot_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'torchflower_crop': {
		Type: TransType.Item,
		Override: 'torchflower_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'pitcher_crop': {
		Type: TransType.Item,
		Override: 'pitcher_pod',
		StateHandler: v => getGrowth(v, 'growth', 4),
	},
	'carrots': {
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'potatoes': {
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	'stone': {
		StateHandler: v => [`stone.${upperCaseWhenUnderscore(<string>v.states.get('stone_type'))}`],
	},
	'monster_egg': {
		StateHandler: v => {
			let s = (<string>v.states.get('monster_egg_stone_type'))
				.replace(/[\_]/g, '')
				.replace('stone', '')
			return [`monster_egg${s ? '.' + s : ''}`]
		},
	},
	'yellow_flower': {
		Override: 'yellow_flower.dandelion',
	},
	'red_flower': {
		StateHandler: v => {
			let key = <string>v.states.get('flower_type')
			key =
				{
					orchid: 'blue_orchid',
					oxeye: 'oxeye_daisy',
				}[key]! ?? key
			return [`${v.lang.Name}.${upperCaseWhenUnderscore(key)}`]
		},
	},
	'double_plant': {
		StateHandler: v => {
			return [`${v.lang.Name}.${v.states.get('double_plant_type')}`]
		},
	},
	'*_log': {
		StateHandler: v => {
			let a = v.lang.Name.split('_')
			return ['oak', 'birch', 'spruce', 'jungle', 'acacia', 'dark'].includes(a[0])
				? [`${a.pop()}.${a.includes('dark') ? 'big_oak' : a.join('_')}`]
				: []
		},
	},
	'leaves': {
		StateHandler: v => {
			return [`${v.lang.Name}.${v.states.get('old_leaf_type')}`]
		},
	},
	'leaves2': {
		StateHandler: v => {
			let s = v.states.get('new_leaf_type')
			return [`${v.lang.Name}.${s == 'dark_oak' ? 'big_oak' : s}`]
		},
	},
	'wood': {
		StateHandler: v => {
			let s = v.states.get('wood_type')
			let s2 = v.states.get('stripped_bit')
			return [`${v.lang.Name}.${s2 ? 'stripped.' : ''}${s}`]
		},
	},
	'*_planks': {
		StateHandler: v => {
			let a = v.lang.Name.split('_')
			return ['oak', 'birch', 'spruce', 'jungle', 'acacia'].includes(a[0])
				? [`${a.pop()}.${a.join('_')}`]
				: []
		},
	},
	'dark_oak_planks': {
		Override: 'planks.big_oak',
	},
	'wooden_slab': {
		Ref: 'planks',
	},
	'wall_banner': {
		Override: 'standing_banner',
	},
	'*_door': {
		Type: TransType.Item,
	},
	'*_glazed_terracotta': {
		StateHandler: v => {
			let s = v.lang.Name.split('glazed_terracotta')
			return [
				`${upperCaseWhenUnderscore(
					`glazed_terracotta_${s[0].substring(0, s[0].length - 1)}`
				)}`,
			]
		},
	},
	'cobblestone_wall': {
		StateHandler: v => {
			let s = (<string>v.states.get('wall_block_type')).split('_')
			if (s.includes('cobblestone')) s.pop()
			if (!s.length) s.push('normal')
			return [`${v.lang.Name}.${s.join('_')}`]
		},
	},
	'powered_comparator': {
		Type: TransType.Item,
		Override: 'comparator',
	},
	'comparator': {
		Type: TransType.Item,
	},
	'sticky_piston_arm_collision': {
		Override: 'sticky_piston',
	},
	'piston_arm_collision': {
		Override: 'piston',
	},
	'oak_fence': {
		Override: 'fence',
	},
	'spruce_fence': {
		Override: 'spruceFence',
	},
	'birch_fence': {
		Override: 'birchFence',
	},
	'jungle_fence': {
		Override: 'jungleFence',
	},
	'acacia_fence': {
		Override: 'acaciaFence',
	},
	'dark_oak_fence': {
		Override: 'darkOakFence',
	},
	'*_fence_gate': {
		StateHandler: v => [`${upperCaseWhenUnderscore(v.lang.Name)}`],
	},
	'*_stained_glass$': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${[s.pop(), s.pop()].reverse().join('_')}.${s.join('_')}`]
		},
	},
	'*_stained_glass_pane': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${[s.pop(), s.pop(), s.pop()].reverse().join('_')}.${s.join('_')}`]
		},
	},
	'stone_block_slab': {
		Override: 'stone_slab',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type')
			s =
				{
					smooth_stone: 'stone',
					cobblestone: 'cobble',
					stone_brick: 'smoothStoneBrick',
					sandstone: 'sand',
				}[s]! ?? s
			return [`${v.lang.Name}.${s}`]
		},
	},
	'stone_block_slab2': {
		Override: 'stone_slab2',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type_2')
			s =
				{
					smooth_sandstone: 'sandstone.smooth',
					prismarine_rough: 'prismarine.rough',
					prismarine_dark: 'prismarine.dark',
					prismarine_brick: 'prismarine.bricks',
				}[s]! ?? s
			return [`${v.lang.Name}.${s}`]
		},
	},
	'stone_block_slab3': {
		Override: 'stone_slab3',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type_3')
			s =
				{
					smooth_red_sandstone: 'red_sandstone.smooth',
					polished_granite: 'granite.smooth',
					polished_andesite: 'andesite.smooth',
					polished_diorite: 'diorite.smooth',
					end_stone_brick: 'end_brick',
				}[s]! ?? s
			return [`${v.lang.Name}.${s}`]
		},
	},
	'stone_block_slab4': {
		Override: 'stone_slab4',
		StateHandler: v => [`${v.lang.Name}.${v.states.get('stone_slab_type_4')}`],
	},
	'double_stone_block_slab': {
		Ref: 'stone_block_slab',
	},
	'double_stone_block_slab2': {
		Ref: 'stone_block_slab2',
	},
	'double_stone_block_slab3': {
		Ref: 'stone_block_slab3',
	},
	'double_stone_block_slab4': {
		Ref: 'stone_block_slab4',
	},
	'polished_blackstone_brick_double_slab': {
		Override: 'polished_blackstone_brick_slab',
	},
	'stonebrick': {
		StateHandler: v => [`${v.lang.Name}.${v.states.get('stone_brick_type')}`],
	},
	'prismarine': {
		StateHandler: v => {
			let s = v.states.get('prismarine_block_type')
			return [`${v.lang.Name}.${s == 'default' ? 'rough' : s}`]
		},
	},
	'sandstone': {
		StateHandler: v => {
			let s = v.states.get('sand_stone_type')
			return [`${v.lang.Name}.${s == 'heiroglyphs' ? 'chiseled' : s}`]
		},
	},
	'red_sandstone': {
		Ref: 'sandstone',
	},
	'quartz_block': {
		StateHandler: v => [`${v.lang.Name}.${v.states.get('chisel_type')}`],
	},
	'*_wool': {
		Ref: '*_concrete$',
	},
	'moss_carpet': {},
	'*_carpet': {
		Ref: '*_concrete$',
	},
	'*_concrete$': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${s.pop()}.${upperCaseWhenUnderscore(s.join('_'))}`]
		},
	},
	'*_concrete_powder': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [
				`${upperCaseWhenUnderscore(
					[s.pop(), s.pop()].reverse().join('_')
				)}.${upperCaseWhenUnderscore(s.join('_'))}`,
			]
		},
	},
	'*_terracotta': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			s.pop()
			return [`stained_hardened_clay.${upperCaseWhenUnderscore(s.join('_'))}`]
		},
	},
	'sapling': {
		StateHandler: v => {
			let s = v.states.get('sapling_type')
			return [`${v.lang.Name}.${s == 'dark_oak' ? 'big_oak' : s}`]
		},
	},
	'bamboo_sapling': {
		Override: 'bamboo',
	},
	'tallgrass': {
		StateHandler: v => {
			let s = v.states.get('tall_grass_type')
			return [`${v.lang.Name}.${s == 'tall' ? 'grass' : s}`]
		},
	},
	'*_repeater': {
		Type: TransType.Item,
		Override: 'repeater',
	},
	'*_comparator': {
		Type: TransType.Item,
		Override: 'comparator',
	},
	'undyed_shulker_box': {
		Override: 'shulker_box',
		StateHandler: v => {
			return [upperCaseWhenUnderscore(v.lang.Name)]
		},
	},
	'*_shulker_box': {
		StateHandler: v => {
			let s = v.lang.Name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			let s2 = [s.pop(), s.pop()].reverse()
			s2.push(s.join('_'))
			return [`${upperCaseWhenUnderscore(s2.join('_'))}`]
		},
	},
	'daylight_detector_inverted': {
		Override: 'daylight_detector',
	},
	'purpur_block': {
		StateHandler: v => [`${v.lang.Name}.${v.states.get('chisel_type')}`],
	},
	'sand': {
		StateHandler: v => {
			return v.states.get('sand_type') == 'red' ? [`sand.red`] : []
		},
	},
	'coral_block': {
		StateHandler: v => {
			let s = v.states.get('coral_color')
			let s2 = v.states.get('dead_bit')
			return s2 ? [`${v.lang.Name}.${s}_dead`] : [`${v.lang.Name}.${s}`]
		},
	},
	'fire_coral': {
		Override: 'coral.red',
	},
	'brain_coral': {
		Override: 'coral.pink',
	},
	'bubble_coral': {
		Override: 'coral.purple',
	},
	'tube_coral': {
		Override: 'coral.blue',
	},
	'horn_coral': {
		Override: 'coral.yellow',
	},
	'dead_fire_coral': {
		Override: 'coral.red_dead',
	},
	'dead_brain_coral': {
		Override: 'coral.pink_dead',
	},
	'dead_bubble_coral': {
		Override: 'coral.purple_dead',
	},
	'dead_tube_coral': {
		Override: 'coral.blue_dead',
	},
	'dead_horn_coral': {
		Override: 'coral.yellow_dead',
	},
	'coral_fan_hang': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.Name}${s2 ? '_dead' : ''}.${s ? 'pink' : 'blue'}_fan`]
		},
	},
	'coral_fan_hang2': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.Name}${s2 ? '_dead' : ''}.${s ? 'red' : 'purple'}_fan`]
		},
	},
	'coral_fan_hang3': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.Name}${s2 ? '_dead' : ''}.${s ? '' : 'yellow'}_fan`]
		},
	},
	'crimson_roots': {
		Override: 'crimson_roots.crimsonRoots',
	},
	'warped_roots': {
		Override: 'warped_roots.warpedRoots',
	},
	'seagrass': {
		Override: 'seagrass.seagrass',
	},
	'skull': {
		Type: TransType.Item,
		Override: 'skull.char',
	},
	'standing_sign': {
		Type: TransType.Item,
		Override: 'sign',
	},
	'mangrove_standing_sign': {
		Type: TransType.Item,
		Override: 'mangrove_sign',
	},
	'cherry_standing_sign': {
		Type: TransType.Item,
		Override: 'cherry_sign',
	},
	'bamboo_standing_sign': {
		Type: TransType.Item,
		Override: 'bamboo_sign',
	},
	'*_hanging_sign': {
		Type: TransType.Item,
	},
	'lit_*': {
		StateHandler: v => {
			return [v.lang.Name.split('lit_')[1]]
		},
	},
	'anvil': {
		StateHandler: v => {
			let s = <string>v.states.get('damage')
			return [`${v.lang.Name}${s == 'undamaged' ? '' : '.' + upperCaseWhenUnderscore(s)}`]
		},
	},
	'brewing_stand': {
		Type: TransType.Item,
	},
	'sea_lantern': {
		Override: 'seaLantern',
	},
	'frame': {
		Type: TransType.Item,
	},
	'glow_frame': {
		Type: TransType.Item,
	},
	'glower_pot': {
		Type: TransType.Item,
	},
}

function getPercent(min: number, max: number, current: number): number {
	const difference = max - min
	const percentage = ((current - min) / difference) * 100
	return Math.round(percentage)
}

function getGrowth(
	handlerParams: StateHandlerParams,
	block_state_name: string,
	min: number = 0,
	max?: number
): (string | RawMessage | undefined)[] {
	if (!max) {
		max = min
		min = 0
	}

	const { states } = handlerParams

	const current = (states.get(block_state_name) as number) ?? 0
	const growthPercentage = getPercent(min, max, current)

	const description = {
		translate: current < max ? `growth.description.0` : `growth.description.1`,
		with: current < max ? [`${growthPercentage}`] : [],
	}

	return [undefined, description]
}

function upperCaseWhenUnderscore(s: string): string {
	return s.replace(/_./g, match => match[1].toUpperCase())
}

export default BlockTranslator
