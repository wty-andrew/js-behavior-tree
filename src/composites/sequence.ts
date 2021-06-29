import { Composite, Status } from '../core'

export class Sequence extends Composite {
  _type = 'Sequence'
  private currentChildIndex = 0

  update(): Status {
    while (this.currentChildIndex < this.children.length) {
      const status = this.children[this.currentChildIndex].tick()
      switch (status) {
        case Status.RUNNING:
          return Status.RUNNING
        case Status.SUCCESS: {
          this.currentChildIndex += 1
          break
        }
        case Status.FAILURE: {
          this.currentChildIndex = 0
          return Status.FAILURE
        }
        default:
          throw new Error(`Invalid return status: ${status} from ${this.name}`)
      }
    }

    this.currentChildIndex = 0
    return Status.SUCCESS
  }
}
