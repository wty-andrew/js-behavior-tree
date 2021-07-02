import { Node, Decorator, Status } from '../core'

export class ForceSuccess extends Decorator {
  update(): Status {
    const child = this.child as Node
    const status = child.tick()

    switch (status) {
      case Status.RUNNING:
        return Status.RUNNING
      case Status.SUCCESS:
      case Status.FAILURE:
        return Status.SUCCESS
      default:
        throw new Error(`Invalid return status: ${status} from ${child.name}`)
    }
  }
}
