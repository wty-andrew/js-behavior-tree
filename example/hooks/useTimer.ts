import { useEffect, useRef } from 'react'

type TimeOut = ReturnType<typeof setInterval>

const useTimer = (
  callback: () => void,
  ms: number
): { start: () => void; stop: () => void } => {
  const timerRef = useRef<TimeOut>()
  const start = () => {
    if (!timerRef.current) timerRef.current = setInterval(callback, ms)
  }
  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }

  useEffect(() => {
    if (timerRef.current) {
      stop()
      start()
    }
  }, [ms])

  return { start, stop }
}

export default useTimer
