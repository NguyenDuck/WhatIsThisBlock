import { Displayer } from './Displayer'
import { Message } from './types'

export default class BlockDescDisplayer extends Displayer {
	private _isChanged = false
	private namespace: string
	private description: Message

	public getNamespace(): string {
		return this.namespace
	}

	public getDescription(): Message {
		return this.description
	}

	public setNamespace(namespace: string) {
		if (this.namespace === namespace) return
		this.namespace = namespace
		this._isChanged = true
	}

	public setDescription(description: Message) {
		if (this.description === description) return
		this.description = description
		this._isChanged = true
	}

	public removeDescription() {
		this.setDescription(``)
	}

	public forceRemoveDescription() {
		this.removeDescription()
		this.send()
	}

	public isChanged(): boolean {
		return this._isChanged
	}

	public isEmpty(): boolean {
		return this.description === ''
	}

	public send(): void {
		if (!this._isChanged) return
		this.sendTitle([`|witb_block_namespace|`, { translate: this.namespace }], this.description)
		this._isChanged = false
	}
}
