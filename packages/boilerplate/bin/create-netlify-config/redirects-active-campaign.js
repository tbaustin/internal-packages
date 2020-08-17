const dirs = require(`./../../dirs`)
const { activeCampaign } = require(`${dirs.site}/config`)


const { account, sandboxAccount } = activeCampaign
const apiKey = process.env.ACTIVE_CAMPAIGN_KEY
const sandboxApiKey = process.env.ACTIVE_CAMPAIGN_SANDBOX_KEY


const makeRedirect = (from, isSandbox) => {
  const fullPath = isSandbox ? `/dev${from}` : from
  const subdomain = isSandbox ? sandboxAccount : account
  const token = isSandbox ? sandboxApiKey : apiKey

  return {
    from: fullPath,
    to: `https://${subdomain}.api-us1.com${fullPath}`,
    status: 200,
    force: true,
    headers: {
      "Api-Token": token
    }
  }
}


const redirectPaths = [
  `/api/3/:params/:id/:subquery`,
  `/api/3/:params/:id`,
  `/api/3/:params`,
]


module.exports = [
  // Prod redirects
  ...redirectPaths.map(p => makeRedirect(p, false)),
  // Sandbox redirects
  ...redirectPaths.map(p => makeRedirect(p, true))
]
