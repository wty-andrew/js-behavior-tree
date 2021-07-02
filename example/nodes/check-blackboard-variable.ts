import { Condition } from '../../src'
import { Blackboard } from '../store/blackboard'

export class CheckBlackboardVariable extends Condition {
  constructor(name: string, variable: string) {
    const pred = () => Blackboard[variable] !== undefined
    super(name, pred)
  }
}
