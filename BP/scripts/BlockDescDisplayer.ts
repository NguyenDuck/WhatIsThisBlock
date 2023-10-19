import DescDisplayer from "./DescDisplayer";

export default class BlockDescDisplayer extends DescDisplayer {

    public forceRemove() {
        this.remove()
        this.send()
    }

    public isEmpty(): boolean {
        return this.description === ""
    }
}