import { useMemo } from 'react'


export default function useId() {
  return useMemo(() => {
    return btoa(Math.random()).substring(0, 12)
  }, [])
}
