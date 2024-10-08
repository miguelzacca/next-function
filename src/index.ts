type Func = (...args: any[]) => any

type Next<T extends Func = Func> = (...args: Partial<Parameters<T>>) => void

type Handler<T extends Func = Func> = (
  ...args: [...Parameters<T>, next: Next<T>]
) => void

const middleware = <T extends Func>(...handlers: [...Handler<T>[], T]) => {
  return ((...args: Parameters<T>) => {
    const createNext = (index: number): Next<T> => {
      return (...newArgs: Partial<Parameters<T>>) => {
        const finalArgs = (newArgs.length > 0 ? newArgs : args) as Parameters<T>

        const nextHandler = handlers[index + 1]
        if (nextHandler) {
          index + 1 === handlers.length - 1
            ? (nextHandler as T)(...finalArgs)
            : nextHandler(...finalArgs, createNext(index + 1))
        }
      }
    }

    handlers[0](...args, createNext(0))
  }) as (...args: Parameters<T>) => void
}

export { middleware, Handler, Next }
