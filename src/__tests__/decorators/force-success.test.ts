import { Status } from '../../core'
import { ForceSuccess } from '../../decorators/force-success'
import { TestNode } from '../helpers'

describe('ForceSuccess', () => {
  let child: TestNode
  let node: ForceSuccess

  beforeEach(() => {
    child = new TestNode('Foo')
    node = new ForceSuccess('Bar')
    node.setChild(child)
  })

  it('returns SUCCESS on child FAILURE', () => {
    child.setUpdateReturnValue(Status.FAILURE)

    expect(node.tick()).toBe(Status.SUCCESS)
  })

  it('returns SUCCESS on child SUCCESS', () => {
    child.setUpdateReturnValue(Status.SUCCESS)

    expect(node.tick()).toBe(Status.SUCCESS)
  })

  it('returns RUNNING on child RUNNING', () => {
    child.setUpdateReturnValue(Status.RUNNING)

    expect(node.tick()).toBe(Status.RUNNING)
  })
})
