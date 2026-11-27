export const LAZY_ROOT_MARGIN = '200px 0px'

type ObserverCtor = typeof IntersectionObserver

/**
 * 真按需加载：未进入 rootMargin 之前不回调。
 * 无 IntersectionObserver 时立即降级为可见。
 */
export function observeLazyLoad(
  el: Element,
  onVisible: () => void,
  Observer: ObserverCtor | undefined = typeof IntersectionObserver === 'undefined'
    ? undefined
    : IntersectionObserver,
): () => void {
  if (!Observer) {
    onVisible()
    return () => {}
  }

  const observer = new Observer(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onVisible()
          observer.disconnect()
          break
        }
      }
    },
    { rootMargin: LAZY_ROOT_MARGIN },
  )
  observer.observe(el)
  return () => observer.disconnect()
}
