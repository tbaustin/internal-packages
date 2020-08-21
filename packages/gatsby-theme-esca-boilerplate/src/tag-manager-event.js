import { useEffect } from 'react'


export default function useTagManagerEvent(templateProps) {
  const {
    tagManagerEvent: event,
    dataSource: data
  } = templateProps?.pageContext || {}

  const listProducts = templateProps?.data?.allBaseProduct?.nodes || []

  const eventObject = {
    event,
    ...data && { data },
    listProducts
  }

  useEffect(() => {
    if (!event) return
    if (!(`dataLayer` in window)) return

    dataLayer.push(eventObject)
  }, [])
}
