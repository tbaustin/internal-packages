import React, { useEffect } from 'react'


export default function useOutsideClickListener(ref, callback) {
  const handleClick = event => {
    const wasOutside = !ref?.current?.contains?.(event.target)
    wasOutside && typeof callback === `function` && callback()
  }

  useEffect(() => {
    document.addEventListener(`mousedown`, handleClick)
    return () => {
      document.removeEventListener(`mousedown`, handleClick)
    }
  }, [ref])
}
