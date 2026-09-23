import { useState } from 'react'

export function Counter({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial)
  return <button type='button' onClick={() => { setCount(count + 1) }}>
      count is {count}
    </button>
}

export function Conditional({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [value] = useState(0)
    return <span>{value}</span>
  }
  return null
}
