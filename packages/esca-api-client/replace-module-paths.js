
/**
 * Rewrite '@sentry/node' as '@sentry/browser' when building for browser
 */
module.exports = (originalPath, callingFileName, options) => {
  if (originalPath.includes(`sentry`)) {
    return `@sentry/${process.env.BABEL_ENV}`
  }

  return originalPath
}
