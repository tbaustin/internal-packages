import fetch from 'fetch-retry'

async function fetchMethod(options) {
  if (!options.site) {
    console.log(`Warning: No site option set.`)
  }
  let ids = []
  if (options.ids) {
    ids.push(...options.ids)
  }
  if (options.id) {
    ids.push(options.id)
  }
  if (!ids.length) {
    return
  }
  // Fetch data
  let res = await fetch(options.endpoint, {
    method: 'POST',
    body: JSON.stringify({
      site: options.site,
      skus: ids
    })
  })
  res = await res.json()
  this.setState(res)

  // Repoll interval
   if (typeof window === 'object') {
    clearTimeout(this.timeout)
     this.timeout = setTimeout(() => {
       this.fetch({
        ...options,
        ids: Object.keys(this.state)
      })
    }, 6 * 1000)
   }
}
export default fetchMethod
