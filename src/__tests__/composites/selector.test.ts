import { Status, Node } from '../../core'
import { Selector } from '../../composites/selector'
import { makeConstantNodes } from '../helpers'

const { RUNNING, FAILURE, SUCCESS } = Status

const selector = (...children: Node[]) => {
  const node = new Selector('Selector')
  node.addChildren(...children)
  return node
}

describe('Selector', () => {
  describe('SUCCESS Case', () => {
    it('returns SUCCESS on first SUCCESS child', () => {
      const [c1, c2, c3] = makeConstantNodes(FAILURE, SUCCESS, SUCCESS)
      const node = selector(c1, c2, c3)

      const status = node.tick()

      expect(status).toBe(SUCCESS)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).not.toBeCalled()
    })

    it('restarts from first child after SUCCESS', () => {
      const [c1, c2] = makeConstantNodes(FAILURE, SUCCESS)
      const node = selector(c1, c2)

      node.tick()
      c1.mockUpdate.mockClear()
      c2.mockUpdate.mockClear()
      node.tick()

      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
    })
  })

  describe('FAILURE Case', () => {
    it('returns FAILURE when all children FAILURE', () => {
      const [c1, c2, c3] = makeConstantNodes(FAILURE, FAILURE, FAILURE)
      const node = selector(c1, c2, c3)

      expect(node.tick()).toBe(FAILURE)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).toBeCalled()
    })
  })

  describe('RUNNING Case', () => {
    it('returns RUNNING on first RUNNING child', () => {
      const [c1, c2, c3] = makeConstantNodes(FAILURE, RUNNING, SUCCESS)
      const node = selector(c1, c2, c3)

      const status = node.tick()

      expect(status).toBe(RUNNING)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).not.toBeCalled()
    })

    it('continues from the RUNNING child', () => {
      const [c1, c2] = makeConstantNodes(FAILURE, RUNNING)
      const node = selector(c1, c2)

      node.tick()
      c1.mockUpdate.mockClear()
      c2.mockUpdate.mockClear()
      node.tick()

      expect(c1.mockUpdate).not.toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
    })
  })
})
