import { Decorator, Status } from '../core'

export class Inverter extends Decorator {
  update(): Status {
    const status = this.child!.tick()

    switch (status) {
      case Status.SUCCESS:
        return Status.FAILURE
      case Status.FAILURE:
        return Status.SUCCESS
      default:
        return status
    }
  }
}
