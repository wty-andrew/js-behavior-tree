import { Decorator, Status } from '../core'

export class ForceSuccess extends Decorator {
  update(): Status {
    if (this.child!.tick() === Status.RUNNING) return Status.RUNNING

    return Status.SUCCESS
  }
}
