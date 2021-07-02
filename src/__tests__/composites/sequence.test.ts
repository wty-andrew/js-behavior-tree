import { Status, Node } from '../../core'
import { Sequence } from '../../composites/sequence'
import { makeConstantNodes } from '../helpers'

const { RUNNING, FAILURE, SUCCESS } = Status

const sequence = (...children: Node[]) => {
  const node = new Sequence('Sequence')
  node.addChildren(...children)
  return node
}

describe('Sequence', () => {
  describe('SUCCESS Case', () => {
    it('returns SUCCESS when all children SUCCESS', () => {
      const [c1, c2, c3] = makeConstantNodes(SUCCESS, SUCCESS, SUCCESS)
      const node = sequence(c1, c2, c3)

      const status = node.tick()

      expect(status).toBe(SUCCESS)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).toBeCalled()
    })
  })

  describe('FAILURE Case', () => {
    it('returns FAILURE on first FAILURE child', () => {
      const [c1, c2, c3] = makeConstantNodes(SUCCESS, FAILURE, SUCCESS)
      const node = sequence(c1, c2, c3)

      const status = node.tick()

      expect(status).toBe(FAILURE)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).not.toBeCalled()
    })

    it('restarts from first child after FAILURE', () => {
      const [c1, c2] = makeConstantNodes(SUCCESS, FAILURE)
      const node = sequence(c1, c2)

      node.tick()
      c1.mockUpdate.mockClear()
      c2.mockUpdate.mockClear()
      node.tick()

      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
    })
  })

  describe('RUNNING Case', () => {
    it('returns RUNNING on first RUNNING child', () => {
      const [c1, c2, c3] = makeConstantNodes(SUCCESS, RUNNING, SUCCESS)
      const node = sequence(c1, c2, c3)

      const status = node.tick()

      expect(status).toBe(RUNNING)
      expect(c1.mockUpdate).toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
      expect(c3.mockUpdate).not.toBeCalled()
    })

    it('continues from the RUNNING child', () => {
      const [c1, c2] = makeConstantNodes(SUCCESS, RUNNING)
      const node = sequence(c1, c2)

      node.tick()
      c1.mockUpdate.mockClear()
      c2.mockUpdate.mockClear()
      node.tick()

      expect(c1.mockUpdate).not.toBeCalled()
      expect(c2.mockUpdate).toBeCalled()
    })
  })
})
