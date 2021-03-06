import { Composite, Status } from '../core'

export class Selector extends Composite {
  _type = 'Selector'
  private currentChildIndex = 0

  update(): Status {
    while (this.currentChildIndex < this.children.length) {
      const child = this.children[this.currentChildIndex]

      const status = child.tick()
      switch (status) {
        case Status.RUNNING:
          return Status.RUNNING
        case Status.SUCCESS: {
          this.currentChildIndex = 0
          return Status.SUCCESS
        }
        case Status.FAILURE: {
          this.currentChildIndex += 1
          break
        }
        default:
          throw new Error(`Invalid return status: ${status} from ${child.name}`)
      }
    }

    this.currentChildIndex = 0
    return Status.FAILURE
  }
}
