import React from 'react'
import Layout from '../layout'
import SEO from '../components/seo'
import Container from '../components/container'


export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="Page Not found" />
      <div className="page-content">
        <Container width="constrained" align="flex-start" smartPadding>
          <h1>Not found</h1>
          <p>The page you requested doesn't exist...</p>
        </Container>
      </div>
    </Layout>
  )
}
