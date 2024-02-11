import { RawMessage } from '@minecraft/server'

export type Message = string | RawMessage | (string | RawMessage)[]

export type BlockStateMap = Map<string, string | number | boolean>

export enum TransType {
	Block = 'tile',
	Item = 'item',
	Entity = 'entity',
}

export class TransKey {
	constructor(public Prefix: TransType, public Name: string) {}

	toString(): string {
		return `${this.Prefix}.${this.Name}.name`
	}

	toRawMessage(): RawMessage {
		return {
			translate: this.toString(),
		}
	}

	equals(other: TransKey): boolean {
		return this.Prefix === other.Prefix && this.Name === other.Name
	}
}

export type StateHandlerParams = {
	lang: TransKey
	states: BlockStateMap
}

export type StateHandler = (args: StateHandlerParams) => (string | RawMessage | undefined)[]

export type BlockTransEntry = {
	Type?: TransType
	Override?: string
	StateHandler?: StateHandler
	Ref?: string
}
export interface IBlockTranslator {
	[key: string]: BlockTransEntry
}
