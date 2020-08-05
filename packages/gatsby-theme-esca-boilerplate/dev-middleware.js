const proxy = require(`http-proxy-middleware`).createProxyMiddleware
const { parse: parseUrl } = require(`url`)
const { parse: parseToml } = require(`@iarna/toml`)
const { readFileSync } = require(`fs-extra`)


const dirs = require(`@escaladesports/boilerplate/dirs`)

const netlifyToml = readFileSync(`${dirs.site}/netlify.toml`, `utf8`)
const redirects = parseToml(netlifyToml).redirects || []


/**
 * Set up redirects specified in netlify.toml to work in local dev server
 * We have to manually recreate them because nothing locally does anything with
 * the netlify.toml file
 */
module.exports = app => {
  // Proxy lambda endpoints
  app.use(`/.netlify/functions/`, proxy({
    target: `http://localhost:9000`,
    pathRewrite: {
      '/.netlify/functions': ``,
    },
  }))

  /**
   * CMS - uses redirect rather than proxy since Sanity has issues with
   * pseudo-HTTPS locally
   */
  app.use(`/admin`, (req, res) => {
    res.redirect(`http://localhost:3333/admin`)
  })

  // Create redirects from netlify.toml
  if (redirects.length) {
    redirects.forEach(redirect => {
      const { from, to, status, headers } = redirect

      // Proxy external 200 redirects (except CMS paths)
      const shouldProxy = (
        from && !from.includes(`/admin`) &&
        to.includes(`http`) && status === 200
      )

      if (shouldProxy) {
        const { protocol, host, path } = parseUrl(to)
        const target = `${protocol}//${host}`

        app.use(from, proxy({
          target,
          changeOrigin: true,
          headers,
          secure: false,
          pathRewrite: () => path
        }))
      }
    })
  }
}
