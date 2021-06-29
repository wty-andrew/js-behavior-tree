export enum Status {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNKNOWN = 'UNKNOWN',
}

export abstract class Node {
  readonly name: string
  _type = 'Node'
  public status: Status = Status.IDLE
  public tickCount = 0

  constructor(name: string) {
    this.name = name
  }

  setup?(): void

  abstract update(): Status

  tick(): Status {
    this.tickCount += 1

    const newStatus = this.update()

    this.status = newStatus

    return newStatus
  }

  get type(): string {
    return this._type
  }
}

export abstract class Composite extends Node {
  children: Node[] = []

  setup(): void {
    if (this.children.length === 0)
      throw new Error(`Composite: ${this.name} has no children`)

    this.children.forEach((child) => child.setup?.())
  }

  addChild(node: Node): void {
    this.children.push(node)
  }
}

export abstract class Decorator extends Node {
  _type = 'Decorator'
  child?: Node

  setup(): void {
    if (!this.child) throw new Error(`Decorator: ${this.name} has no child`)

    this.child.setup?.()
  }

  setChild(node: Node): void {
    if (this.child)
      throw new Error(`Decorator: ${this.name} has a child already`)

    this.child = node
  }
}

export class Condition extends Node {
  _type = 'Condition'
  private pred: () => boolean

  constructor(name: string, pred: () => boolean) {
    super(name)
    this.pred = pred
  }

  update(): Status {
    return this.pred() ? Status.SUCCESS : Status.FAILURE
  }
}
