import { Topic, Message } from 'roslib'

import { Node, Status } from '../../src'
import { Blackboard } from '../store/blackboard'
import { ros } from '../ros'

export class ToBlackboard<T extends Message> extends Node {
  readonly topic: string
  readonly messageType: string
  readonly variable: string
  private subscriber: Topic
  private message?: T

  constructor(
    name: string,
    topic: string,
    messageType: string,
    variable: string
  ) {
    super(name)
    this.variable = variable
    this.topic = topic
    this.messageType = messageType
  }

  setup(): void {
    this.subscriber = new Topic({
      ros,
      name: this.topic,
      messageType: this.messageType,
    })
    this.subscriber.subscribe((msg) => {
      this.message = msg as T
    })
  }

  update(): Status {
    if (this.message === undefined) return Status.RUNNING

    Blackboard[this.variable] = this.message
    this.message = undefined

    return Status.SUCCESS
  }
}
