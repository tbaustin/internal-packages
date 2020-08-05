import { useEffect, useState } from 'react'
import sanityClient from 'part:@sanity/base/client'


/**
 * Gives access to the full documents for an array of references
 */
export default function useDocuments(value) {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const fetchDocuments = async () => {
      const ids = value?.map?.(v => v._ref)
      const result = await sanityClient.getDocuments(ids || [])
      setDocuments(result)
    }

    const isReferenceType = value?.[0]?._type === `reference`
    isReferenceType && fetchDocuments()
  }, [])

  return documents
}
