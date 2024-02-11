import { BlockPermutation } from '@minecraft/server'

export function isPermutationEquals(a: BlockPermutation, b: BlockPermutation): boolean {
	return a.matches(b.type.id, b.getAllStates())
}

export function toBlockStateMap(perm: BlockPermutation): Map<string, string | number | boolean> {
	const states = perm.getAllStates()
	const map = new Map()
	for (const i in states) map.set(i, states[i])
	return map
}
