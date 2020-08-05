import React, { useContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import TemplateEngine from '@escaladesports/sanity-template-engine'
import { useCurrentVariant } from '../current-variant'
import patch from './patch'


/**
 * This context provides template engine functionality to any components needing
 * to use it for parsing strings w/ template variable placeholders or resolving
 * field titles to their values
 */
export const TemplateEngineContext = React.createContext(null)

export const useTemplateEngine = () => useContext(TemplateEngineContext)


export default function Provider(props) {
  const { children, data } = props

  // Set current SKU first variant's SKU if data source is a product
  const initialSku = data?.variants?.[0]?.sku
  const [currentSku, setCurrentSku] = useCurrentVariant(initialSku)

  const queryResult = useStaticQuery(query)

  // Get the Sanity schema from the static query result & parse as JSON
  const typesJson = queryResult?.sanityPersistedSchema?.json || `[]`
  const schema = JSON.parse(typesJson)

  // Get custom fields from static query result (used in patching below)
  const customFields = queryResult?.allSanityCustomField?.nodes || []

  /**
   * Do any on-the-fly patching to the schema & data source (mostly needed for
   * certain product fields)
   */
  const { patchedData, patchedSchema } = patch({
    data: { ...data, currentSku },
    schema,
    customFields
  })

  /**
   * Instantiate the engine to be passed in context value
   * Will provide data source, Sanity schema & parse functions to consumers
   */
  const engine = TemplateEngine({
    schema: patchedSchema,
    data: patchedData
  })

  /**
   * Provide a function for patching any custom data source intended to be used
   * as 2nd arg for parse() or resolveProperty()
   */
  const patchCustomData = customData => patch({
    data: { ...customData, currentSku },
    schema,
    customFields
  })

  const providerValue = { ...engine, patchCustomData }

  return (
    <TemplateEngineContext.Provider value={providerValue}>
      {children}
    </TemplateEngineContext.Provider>
  )
}


const query = graphql`
  query TemplateEngineQuery {
    sanityPersistedSchema(_id: { eq: "sanity-schema" }) {
      json
    }

    allSanityCustomField {
	    nodes {
	      _id
	      name
	      useAsName
	      useAsListImage
	      fieldType
	      salsifyName
	      attributeWidget
	    }
	  }
  }
`
