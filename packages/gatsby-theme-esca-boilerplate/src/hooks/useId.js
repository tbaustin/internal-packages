import { useMemo } from 'react'


export default function useId() {
  return useMemo(() => {
    /**
     * Probably not how it should be done...Should probably implement an
     * isomorphic package for build-time execution, but this hook isn't being
     * used anywhere yet anyway...¯\_(ツ)_/¯
     */
    if (typeof window === `undefined`) return null

    return btoa(Math.random()).substring(0, 12)
  }, [])
}
