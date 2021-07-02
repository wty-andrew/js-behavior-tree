import { Status } from './core'

export const NODE_SYMBOL: Record<string, string> = {
  Selector: '?',
  Sequence: '→',
  Decorator: 'δ',
  Condition: '≺',
  Node: '◌',
}

export const nodeSymbol = (nodeType: string): string =>
  NODE_SYMBOL[nodeType] || NODE_SYMBOL.Node

export const statusSymbol = (status: Status): string => {
  switch (status) {
    case Status.IDLE:
      return '-'
    case Status.RUNNING:
      return '…'
    case Status.SUCCESS:
      return '✓'
    case Status.FAILURE:
      return '✕'
  }
}
