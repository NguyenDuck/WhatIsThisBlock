import {
	Block,
	BlockPermutation,
	BlockType,
	BlockTypes,
	Container,
	EntityInventoryComponent,
	ItemLockMode,
	ItemStack,
	Player,
	Vector3,
	system,
} from '@minecraft/server'
import BlockTranslator from './BlockTranslator'
import BlockBase from './BlockBase'
import { BlockTransEntry, StateHandler, TransKey, TransType } from './types'
import BlockNameDisplayer from './BlockNameDisplayer'
import BlockDescDisplayer from './BlockDescDisplayer'
import { isPermutationEquals, toBlockStateMap } from './utils'
import Settings from './Settings'

const addLine = (a: string[]) => a.push('\n')
const pushText = (a: string[], s: string) => a.push(s)

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
		Type?: BlockType
		Location?: Vector3
		Permutation?: BlockPermutation
	}

	constructor(protected player: Player) {
		this.displayer = {
			name: new BlockNameDisplayer(player),
			desc: new BlockDescDisplayer(player),
		}
		this.lastBlock = {
			Type: BlockTypes.get('air'),
		}
	}

	public send(block?: Block): void {
		if (!block) return this.handleNonBlock()

		this.block = new BlockBase(block)

		// if (Settings.debugMode) this.logCurrentBlock()

		this.langKey = new TransKey(
			TransType.Block,
			this.block.isVanilla ? this.block.getName() : this.block.getTypeId()
		)
		this.displayer.desc.setNamespace(this.block.getNamespace())

		const translator = this.getTranslator()

		if (translator) this.handleTranslator(translator)
		else {
			this.displayer.name.setName(this.langKey)
			if (this.displayer.name.isChanged()) {
				let old_item = this.item
				const new_item = this.block.getItemStack()
				new_item.lockMode = ItemLockMode.slot
				new_item.setLore(['witb locked'])
				system.runTimeout(() => this.displayer.name.send(), 0)
				this.item = new_item
				if (!this.displayer.desc.isEmpty())
					system.runTimeout(() => this.displayer.desc.forceRemoveDescription(), 1)
				system.runTimeout(() => (this.item = old_item), 2)
			}
			if (this.displayer.desc.isChanged()) {
				system.runTimeout(() => this.displayer.desc.send(), 1)
			}
		}
		this.lastBlock = {
			Type: this.block.getType(),
			Location: this.block.getLocation(),
			Permutation: this.block.getPermutation(),
		}
	}

	private logCurrentBlock() {
		const text = ['§a', this.block.getTypeId()]

		let states = this.block.getPermutation().getAllStates()
		if (states.length) {
			addLine(text)
			pushText(
				text,
				`§6${JSON.stringify(
					states,
					(_, v) => {
						let i = ['string', 'number', 'boolean'].indexOf(typeof v)
						return i === -1 ? v : `§${['g', 'b', 'd'][i]}${v}§6`
					},
					'*'
				)}`
			)
		}

		addLine(text)
		pushText(text, `§cTranslator: §9${this.getKeyTranslator()}`)

		const s = text.join('')
		s.replace(/"|,|\*/g, '')
		s.replace(/(^\{\n|\{|\}|\}\n$)/g, '')

		this.player.onScreenDisplay.setActionBar(s)
	}

	private handleNonBlock() {
		if (this.lastBlock.Type) {
			this.lastBlock = {}
			this.lastTranslator = undefined
			this.displayer.name.removeName()
			this.displayer.desc.removeDescription()
		}
	}

	private handleTranslator(trans: BlockTransEntry) {
		if (trans.Type) {
			this.langKey.Prefix = trans.Type
		}
		if (trans.Override) this.langKey.Name = trans.Override
		if (trans.StateHandler) this.handleState(trans.StateHandler)
		else {
			this.displayer.name.setName(this.langKey)
			if (this.displayer.name.isChanged()) {
				let old_item = this.item
				const new_item = this.block.getItemStack()
				new_item.lockMode = ItemLockMode.slot
				new_item.setLore(['witb locked'])
				system.runTimeout(() => this.displayer.name.send(), 0)
				this.item = new_item
				if (!this.displayer.desc.isEmpty())
					system.runTimeout(() => this.displayer.desc.forceRemoveDescription(), 1)
				system.runTimeout(() => (this.item = old_item), 2)
			}
			if (this.displayer.desc.isChanged()) {
				system.runTimeout(() => this.displayer.desc.send(), 1)
			}
		}
	}

	private handleState(callback: StateHandler) {
		const perm = this.block.getPermutation()
		if (this.lastBlock.Permutation && isPermutationEquals(this.lastBlock.Permutation, perm))
			return
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
			new_item.setLore(['witb locked'])
			system.runTimeout(() => this.displayer.name.send(), 0)
			this.item = new_item
			system.runTimeout(() => (this.item = old_item), 2)
		}

		if (this.displayer.desc.isChanged()) {
			system.runTimeout(() => this.displayer.desc.send(), 1)
		}
	}

	private get item(): ItemStack | undefined {
		return this.getPlayerContainer().getSlot(17).getItem()
	}

	private set item(item: ItemStack | undefined) {
		this.getPlayerContainer().setItem(17, item)
	}

	private getPlayerContainer(): Container {
		if (!this.playerInv)
			this.playerInv = this.player.getComponent(
				EntityInventoryComponent.componentId
			) as EntityInventoryComponent
		return this.playerInv.container!
	}

	private getKeyTranslator(): string {
		return this._lastKeyTranslator
	}

	private getTranslator() {
		const lang = this.block.getName()
		let trans = BlockTranslator[lang]
		this._lastKeyTranslator = lang
		if (trans && trans.Ref) {
			trans = BlockTranslator[trans.Ref]
			this._lastKeyTranslator = trans.Ref!
		}
		if (!trans) {
			for (const key in BlockTranslator) {
				let pattern = key.replace('*', '[a-z]+')
				if (pattern === key) continue
				pattern = `(${pattern})`
				if (lang.match(pattern)) {
					trans = BlockTranslator[key]
					if (Settings.debugMode) console.log('GetTranslator', JSON.stringify(trans))
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
