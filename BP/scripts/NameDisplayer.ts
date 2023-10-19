import Displayer from './Displayer';
import { TransKey, TransType } from './types';

export default class NameDisplayer extends Displayer {

    private _isChanged: boolean = false
    private _name: TransKey

    public isChanged(): boolean {
        return this._isChanged
    }

    public get name(): TransKey {
        return this._name
    }

    public set name(value: TransKey) {
        if (this._name && this._name.equals(value)) return
        this._name = value
        this._isChanged = true
    }

    public send() {
        if (!this._isChanged) return
        this.sendTitle(`|witb_changed_icon|`, [`|witb_name|`, this._name.toString()])
    }

    public remove() {
        this._name = new TransKey(TransType.Block, "")
        this.sendTitle(`|witb_view_disabled|`)
        this._isChanged = false
    }
}