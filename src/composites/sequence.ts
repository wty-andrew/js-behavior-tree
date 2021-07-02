import { Composite, Status } from '../core'

export class Sequence extends Composite {
  _type = 'Sequence'
  private currentChildIndex = 0

  update(): Status {
    while (this.currentChildIndex < this.children.length) {
      const child = this.children[this.currentChildIndex]

      const status = child.tick()
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
          throw new Error(`Invalid return status: ${status} from ${child.name}`)
      }
    }

    this.currentChildIndex = 0
    return Status.SUCCESS
  }
}
