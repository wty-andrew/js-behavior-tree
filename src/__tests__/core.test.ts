import { Status, Condition } from '../core'
import { TestNode, TestCompositeNode, TestDecoratorNode } from './helpers'

describe('Node', () => {
  let node: TestNode

  beforeEach(() => {
    node = new TestNode('Foo')
  })

  it('initialized correctly', () => {
    expect(node.status).toBe(Status.IDLE)
    expect(node.tickCount).toBe(0)
  })

  it('increases tickCount when ticked', () => {
    node.tick()

    expect(node.tickCount).toBe(1)
  })

  it('calls updated method when ticked', () => {
    node.tick()

    expect(node.mockUpdate).toBeCalled()
  })

  it('updates / returns status when ticked', () => {
    let status = Status.RUNNING
    node.setUpdateReturnValue(status)
    expect(node.tick()).toBe(status)
    expect(node.status).toBe(status)

    status = Status.SUCCESS
    node.setUpdateReturnValue(status)
    expect(node.tick()).toBe(status)
    expect(node.status).toBe(status)

    status = Status.FAILURE
    node.setUpdateReturnValue(status)
    expect(node.tick()).toBe(status)
    expect(node.status).toBe(status)
  })
})

describe('Composite Node', () => {
  it('throws when setup is called before children added', () => {
    const node = new TestCompositeNode('Foo')

    expect(() => node.setup()).toThrow()
  })
})

describe('Decorator Node', () => {
  it('throws when setup is called before child is set', () => {
    const node = new TestDecoratorNode('Foo')

    expect(() => node.setup()).toThrow()
  })

  it('throws when child is set more than once', () => {
    const node = new TestDecoratorNode('Foo')
    const child1 = new TestNode('Bar')
    node.setChild(child1)

    const setChildAgain = () => {
      const child2 = new TestNode('Baz')
      node.setChild(child2)
    }

    expect(setChildAgain).toThrow()
  })
})

describe('Condition Node', () => {
  it('returns SUCCESS/FAILURE based on predicate result', () => {
    const pred = jest.fn<boolean, []>()
    const node = new Condition('Foo', pred)

    pred.mockReturnValue(true)
    expect(node.tick()).toBe(Status.SUCCESS)

    pred.mockReturnValue(false)
    expect(node.tick()).toBe(Status.FAILURE)
  })
})
