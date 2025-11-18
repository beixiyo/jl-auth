const scriptPromiseMap = new Map<string, Promise<void>>()

/**
 * 动态加载第三方脚本并返回执行结果
 */
export async function loadScript<T = HTMLScriptElement>(
  options: LoadScriptOptions<T>
): Promise<T> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('loadScript 仅能在浏览器环境中使用')
  }

  const existingResult = options.getResult?.()
  if (existingResult) {
    return existingResult
  }

  await ensureScriptElement(options)

  if (options.getResult) {
    const result = options.getResult()
    if (result) {
      return result
    }
    throw new Error(
      options.errorMessage ??
        `脚本 ${options.src} 加载完成但未找到预期对象`
    )
  }

  const script = document.querySelector<HTMLScriptElement>(
    `script[src="${options.src}"]`
  )

  if (!script) {
    throw new Error(options.errorMessage ?? `脚本 ${options.src} 加载失败`)
  }

  return script as unknown as T
}

async function ensureScriptElement<T>({
  src,
  attributes,
  appendTo,
  errorMessage,
}: LoadScriptOptions<T>) {
  const cachedPromise = scriptPromiseMap.get(src)
  if (cachedPromise) {
    return cachedPromise
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    )

    const script = existingScript ?? document.createElement('script')

    const cleanup = () => {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
      scriptPromiseMap.delete(src)
    }

    const onLoad = () => {
      cleanup()
      resolve()
    }

    const onError = () => {
      cleanup()
      reject(new Error(errorMessage ?? `脚本 ${src} 加载失败`))
    }

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })

    if (!existingScript) {
      script.src = src
      script.async = true
      if (attributes) {
        Object.assign(script, attributes)
      }
      const target =
        appendTo ?? document.head ?? document.body ?? document.documentElement
      target.appendChild(script)
    }
  })

  scriptPromiseMap.set(src, promise)

  return promise
}

type ScriptAttributes = Partial<
  Pick<
    HTMLScriptElement,
    | 'async'
    | 'defer'
    | 'crossOrigin'
    | 'referrerPolicy'
    | 'nonce'
    | 'type'
    | 'fetchPriority'
  >
>

export type LoadScriptOptions<T> = {
  src: string
  /**
   * 返回脚本执行后预期挂载的对象/值，用于幂等获取
   */
  getResult?: () => T | undefined
  /**
   * 自定义脚本属性，例如 async / defer / type 等
   */
  attributes?: ScriptAttributes
  /**
   * 指定脚本注入目标节点，默认 document.head
   */
  appendTo?: HTMLElement
  /**
   * 自定义脚本加载失败的错误文案
   */
  errorMessage?: string
}
