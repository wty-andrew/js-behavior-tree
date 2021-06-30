import { Status, Node, Composite, Decorator } from './core'
import { nodeSymbol, statusSymbol } from './constants'

export type TreeNode<T extends Record<string, any>> = T & {
  children: TreeNode<T>[]
}

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

// general utils
export const mapTree = <T>(node: Node, fn: (node: Node) => T): TreeNode<T> => {
  const getChildren = (node: Node): Node[] => {
    if (node instanceof Composite) return node.children
    if (node instanceof Decorator) return node.child ? [node.child] : []
    return []
  }

  return {
    ...fn(node),
    children: getChildren(node).map((child) => mapTree(child, fn)),
  }
}

// debug utils
export const snapShot = (root: Node): TreeNode<NodeProps> =>
  mapTree(
    root,
    ({ name, type, status, tickCount }: Node): NodeProps => ({
      name,
      type,
      status,
      tickCount,
    })
  )

export const treeRepr = (root: TreeNode<NodeProps>): string => {
  const nodeRepr = ({ name, type, status }: NodeProps) =>
    `[${nodeSymbol(type)}] ${name} (${statusSymbol(status)})`

  const rec = (node: TreeNode<NodeProps>, padding: string): string[] => [
    `${padding.slice(0, -4)}${nodeRepr(node)}`,
    ...node.children.flatMap((child, i) =>
      rec(child, padding + (i === node.children.length - 1 ? '    ' : ' │  '))
    ),
  ]

  return rec(root, '    ').join('\n')
}

export const deriveNodeInfo = (
  before: TreeNode<NodeProps>,
  after: TreeNode<NodeProps>
): TreeNode<NodeInfo> => {
  if (
    before.name !== after.name ||
    before.type !== after.type ||
    before.children.length !== after.children.length
  )
    throw new Error('Nodes are different')

  const active = after.tickCount > before.tickCount

  return {
    name: before.name,
    type: before.type,
    active,
    prevStatus: before.status,
    status: active ? after.status : Status.UNKNOWN,
    tickCount: after.tickCount,
    children: [...Array(before.children.length)].map((_, i) =>
      deriveNodeInfo(before.children[i], after.children[i])
    ),
  }
}
