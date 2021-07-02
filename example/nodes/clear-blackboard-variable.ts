import { Node, Status } from '../../src'
import { Blackboard } from '../store/blackboard'

export class ClearBlackboardVariable extends Node {
  variable: string

  constructor(name: string, variable: string) {
    super(name)
    this.variable = variable
  }

  update(): Status {
    Blackboard[this.variable] = undefined
    return Status.SUCCESS
  }
}
