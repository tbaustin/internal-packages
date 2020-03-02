import Store from 'escalade-price-store'

const stores = {}

function getStore(options, ids) {
	if(ids){
		options = {
			site: options,
			ids: ids,
		}
	}
	options = {
		site: process.env.SITE_ID || process.env.GATSBY_SITE_ID,
		...options
	}
	if (!(options.site in stores)) {
		stores[options.site] = new Store(options)
	}
	else if(options.ids){
		stores[options.site].addIds(options.ids)
	}
	return stores[options.site]
}

export default getStore