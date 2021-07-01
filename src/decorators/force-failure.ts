import { Decorator, Status } from '../core'

export class ForceFailure extends Decorator {
  update(): Status {
    if (this.child!.tick() === Status.RUNNING) return Status.RUNNING

    return Status.FAILURE
  }
}
