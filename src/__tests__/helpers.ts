import { Node, Composite, Decorator, Status } from '../core'

// see https://github.com/microsoft/TypeScript/issues/29653
type AbstractConstructor<T> = abstract new (...args: any[]) => T

export const TestNodeMixin = <TBase extends AbstractConstructor<Node>>(
  Base: TBase
) => {
  abstract class Mixin extends Base {
    mockUpdate = jest.fn<Status, []>()

    setUpdateReturnValue(status: Status): void {
      this.mockUpdate.mockReturnValue(status)
    }

    setUpdateReturnValues(...values: Status[]): void {
      for (const status of values) this.mockUpdate.mockReturnValueOnce(status)
    }

    update(): Status {
      return this.mockUpdate()
    }
  }

  return Mixin
}

export class TestNode extends TestNodeMixin(Node) {}

export class TestCompositeNode extends TestNodeMixin(Composite) {}

export class TestDecoratorNode extends TestNodeMixin(Decorator) {}
