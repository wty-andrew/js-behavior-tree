import { Status, Node, Composite, Decorator } from './core'
import { nodeSymbol, statusSymbol } from './constants'

export interface NodeProps {
  name: string
  type: string
  status: Status
  tickCount: number
}

export interface NodeInfo extends NodeProps {
  active: boolean
  prevStatus: Status
}

export type TreeNode<T extends Record<string, any>> = T & {
  children: TreeNode<T>[]
}

export type TreeState = TreeNode<NodeProps>

export type TreeInfo = TreeNode<NodeInfo>

// general utils
const getChildren = (node: Node): Node[] => {
  if (node instanceof Composite) return node.children
  if (node instanceof Decorator) return node.child ? [node.child] : []
  return []
}

export const mapTree = <T>(fn: (node: Node) => T, node: Node): TreeNode<T> => ({
  ...fn(node),
  children: getChildren(node).map((child) => mapTree(fn, child)),
})

// debug utils
const pickNodeProps = ({ name, type, status, tickCount }: Node): NodeProps => ({
  name,
  type,
  status,
  tickCount,
})

export const snapShot = (root: Node): TreeState => mapTree(pickNodeProps, root)

export const treeRepr = (root: TreeState): string => {
  const nodeRepr = ({ name, type, status }: NodeProps) =>
    `[${nodeSymbol(type)}] ${name} (${statusSymbol(status)})`

  const rec = (node: TreeState, padding: string): string[] => [
    `${padding.slice(0, -4)}${nodeRepr(node)}`,
    ...node.children.flatMap((child, i) =>
      rec(child, padding + (i === node.children.length - 1 ? '    ' : ' │  '))
    ),
  ]

  return rec(root, '    ').join('\n')
}

export const treeInfo = (prev: TreeState, curr: TreeState): TreeInfo => {
  if (
    prev.name !== curr.name ||
    prev.type !== curr.type ||
    prev.children.length !== curr.children.length
  )
    throw new Error('Nodes are different')

  return {
    name: prev.name,
    type: prev.type,
    active: curr.tickCount > prev.tickCount,
    prevStatus: prev.status,
    status: curr.status,
    tickCount: curr.tickCount,
    children: [...Array(prev.children.length)].map((_, i) =>
      treeInfo(prev.children[i], curr.children[i])
    ),
  }
}

export class BehaviorTree {
  root: Node
  info: TreeInfo
  prevState: TreeState

  constructor(root: Node) {
    this.root = root

    const state = snapShot(root)
    this.info = treeInfo(state, state)
    this.prevState = state
  }

  setup(): void {
    this.root.setup?.()
  }

  tick(): Status {
    const status = this.root.tick()

    const currState = snapShot(this.root)
    this.info = treeInfo(this.prevState, currState)
    this.prevState = currState

    return status
  }
}
