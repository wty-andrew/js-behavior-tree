import { Status } from '../../core'
import { ForceFailure } from '../../decorators/force-failure'
import { TestNode } from '../helpers'

describe('ForceFailure', () => {
  let child: TestNode
  let node: ForceFailure

  beforeEach(() => {
    child = new TestNode('Foo')
    node = new ForceFailure('Bar')
    node.setChild(child)
  })

  it('returns FAILURE on child FAILURE', () => {
    child.setUpdateReturnValue(Status.FAILURE)

    expect(node.tick()).toBe(Status.FAILURE)
  })

  it('returns FAILURE on child SUCCESS', () => {
    child.setUpdateReturnValue(Status.SUCCESS)

    expect(node.tick()).toBe(Status.FAILURE)
  })

  it('returns RUNNING on child RUNNING', () => {
    child.setUpdateReturnValue(Status.RUNNING)

    expect(node.tick()).toBe(Status.RUNNING)
  })
})
