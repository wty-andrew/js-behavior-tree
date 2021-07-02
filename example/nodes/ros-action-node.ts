import { Message, ActionClient, Goal } from 'roslib'

import { Node, Status } from '../../src'
import { ros } from '../ros'

export class RosActionNode<
  TGoal extends Message,
  TResult extends Message
> extends Node {
  readonly serverName: string
  readonly actionType: string
  readonly timeout: number
  private makeGoal: () => TGoal | null // null for invalid goal
  private onResult: (result: TResult) => boolean
  private state: 'idle' | 'loading' | 'success' | 'error' = 'idle'
  private taskId = 0
  private actionClient: ActionClient

  constructor(
    name: string,
    serverName: string,
    actionType: string,
    makeGoal: () => TGoal | null,
    onResult: (result: TResult) => boolean = () => true,
    timeout = 5
  ) {
    super(name)
    this.serverName = serverName
    this.actionType = actionType
    this.timeout = timeout
    this.makeGoal = makeGoal
    this.onResult = onResult
  }

  setup(): void {
    this.actionClient = new ActionClient({
      ros,
      serverName: this.serverName,
      actionName: this.actionType,
      timeout: this.timeout,
    })
  }

  update(): Status {
    switch (this.state) {
      case 'idle': {
        this.state = 'loading'
        this.taskId += 1
        const taskId = this.taskId

        const goalMessage = this.makeGoal()
        if (!goalMessage) return Status.FAILURE

        const goal = new Goal({ actionClient: this.actionClient, goalMessage })

        goal.on('result', (msg) => {
          if (taskId !== this.taskId) return

          this.state = this.onResult(msg as TResult) ? 'success' : 'error'
        })
        goal.send()

        return Status.RUNNING
      }
      case 'loading':
        return Status.RUNNING
      case 'success':
        this.state = 'idle'
        return Status.SUCCESS
      case 'error':
        this.state = 'idle'
        return Status.FAILURE
    }
  }
}
