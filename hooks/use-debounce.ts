export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}