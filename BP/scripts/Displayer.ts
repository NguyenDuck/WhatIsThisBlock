import { Player, RawMessage } from "@minecraft/server";

export type Message = string | RawMessage | (string | RawMessage)[]

export abstract class Displayer {

    protected player: Player
    private lastMessage: (Message | undefined)[]
    
    constructor(player: Player) {
        this.player = player
        this.lastMessage = [undefined, undefined]
    }

    protected isDuplicate(title: Message, subtitle?: Message): boolean {
        const lastMessage = this.lastMessage
        return lastMessage[0] === title || lastMessage[1] === subtitle
    }

    protected sendTitle(title: Message, subtitle?: Message) {
        if (!this.player.onScreenDisplay.isValid()) return
        this.player.onScreenDisplay.setTitle(title, {
            fadeInDuration: 0,
            fadeOutDuration: 0,
            stayDuration: 0,
            subtitle: subtitle
        })
        this.lastMessage = [title, subtitle]
    }
}