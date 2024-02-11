import { Block, BlockPermutation, BlockType, ItemStack, Vector3 } from '@minecraft/server'

export default class BlockBase {
	private split: string[]
	private namespace: string
	private name: string

	constructor(private block: Block) {
		this.split = block.typeId.split(':')
		this.namespace = this.split[0]
		this.name = this.split[1]
	}

	getTypeId(): string {
		return this.block.type.id
	}

	getType(): BlockType {
		return this.block.type
	}

	getPermutation(): BlockPermutation {
		return this.block.permutation
	}

	getLocation(): Vector3 {
		return this.block.location
	}

	getTags(): string[] {
		return this.block.getTags()
	}

	getItemStack(): ItemStack {
		return this.block.getItemStack()!
	}

	getName(): string {
		return this.name
	}

	getNamespace(): string {
		return this.namespace
	}

	get isVanilla(): boolean {
		return this.namespace == 'minecraft'
	}
}
