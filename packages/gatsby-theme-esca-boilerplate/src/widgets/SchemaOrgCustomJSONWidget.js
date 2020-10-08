import React from 'react'

export default function SchemaOrgCustomJSONWidget(props) {
  const { jsonText } = props
  
	return (
		<script type="application/ld+json">
      { jsonText }
    </script>
	)
}
