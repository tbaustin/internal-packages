import React, {
  useState,
  useEffect,
  useContext,
  createContext
} from 'react'

/**
 * This context/state tracks the SKU of the current variant being viewed by the
 * customer on the page for a base product
 */
const CurrentVariantContext = React.createContext()


export const useCurrentVariant = initialSku => {
  const [currentSku, setCurrentSku] = useContext(CurrentVariantContext)

  useEffect(() => {
    initialSku && setCurrentSku(initialSku)
  }, [])

  return [currentSku, setCurrentSku]
}


export default function Provider(props) {
  const { children } = props

  const [currentSku, setCurrentSku] = useState(``)
  const contextValue = [currentSku, setCurrentSku]

  return (
    <CurrentVariantContext.Provider value={contextValue}>
      {children}
    </CurrentVariantContext.Provider>
  )
}
