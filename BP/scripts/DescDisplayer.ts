import Displayer, { Message } from "./Displayer";


export default class DescDisplaeyer extends Displayer {
    
    private _isChanged: boolean = false
    private _namespace: string
    private _description: Message

    public isChanged(): boolean {
        return this._isChanged
    }

    public get description(): Message {
        return this._description
    }

    public set description(value: Message) {
        if (this._description === value) return
        this._description = value
        this._isChanged = true
    }

    public get namespace(): string {
        return this._namespace
    }

    public set namespace(value: string) {
        if (this._namespace === value) return
        this._namespace = value
        this._isChanged = true
    }

    public send(): void {
        if (!this._isChanged) return
        this.sendTitle([`|witb_namespace|`, { translate: this.namespace }], this.description)
        this._isChanged = false
    }

    public remove(): void {
        this._description = ""
    }
}