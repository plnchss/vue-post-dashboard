export function debounce<F extends (...args: any[]) => void>(fn: F, wait = 500) {
let t: number | undefined
return (...args: Parameters<F>) => {
if (t) window.clearTimeout(t)
t = window.setTimeout(() => fn(...args), wait)
}
}