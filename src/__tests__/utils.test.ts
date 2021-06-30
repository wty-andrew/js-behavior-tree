import { Node } from '../core'
import { mapTree } from '../utils'
import { TestNode, TestCompositeNode, TestDecoratorNode } from './helpers'

describe('mapTree', () => {
  const pickName = ({ name }: Node): { name: string } => ({ name })

  const n1 = new TestNode('n1')
  const n2 = new TestNode('n2')
  const c1 = new TestCompositeNode('c1')
  c1.addChild(n1)
  c1.addChild(n2)

  const n3 = new TestNode('n3')
  const d1 = new TestDecoratorNode('d1')
  d1.setChild(n3)

  const c2 = new TestCompositeNode('c2')
  c2.addChild(c1)
  c2.addChild(d1)

  test('leaf node', () => {
    expect(mapTree(pickName, n1)).toMatchObject({ name: 'n1', children: [] })
  })

  test('composite node', () => {
    expect(mapTree(pickName, c1)).toMatchObject({
      name: 'c1',
      children: [{ name: 'n1' }, { name: 'n2' }],
    })
  })

  test('decorator node', () => {
    expect(mapTree(pickName, d1)).toMatchObject({
      name: 'd1',
      children: [{ name: 'n3' }],
    })
  })

  test('tree with different nodes', () => {
    expect(mapTree(pickName, c2)).toMatchObject({
      name: 'c2',
      children: [
        { name: 'c1', children: [{ name: 'n1' }, { name: 'n2' }] },
        { name: 'd1', children: [{ name: 'n3' }] },
      ],
    })
  })
})
