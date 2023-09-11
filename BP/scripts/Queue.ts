

export default class Queue<T> {
    private items: T[] = []

    public enqueue(item: T): number {
        return this.items.push(item)
    }

    public dequeue(): T | undefined {
        return this.items.pop()
    }

    public peek(): T | undefined {
        return this.items.length > 0 ? this.items[0] : undefined
    }

    public isEmpty(): boolean {
        return this.items.length === 0
    }

    public size(): number {
        return this.items.length
    }

    public clear(): void {
        this.items = []
    }
}