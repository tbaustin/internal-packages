require(`dotenv`).config()
const axios = require(`axios`)
const EscaAPIClient = require(`@escaladesports/esca-api-client`).default
const fs = require(`fs`)
const util = require(`util`)
const writeFile = util.promisify(fs.writeFile)



/**
 * FOR DIAGNOSING UNEXPECTED EMPTY IMAGES IN PRODUCT SERVICE
 * THIS IS VERY MUCH A WORK IN PROGRESS
 * NEEDS REVISIONS TO BE MORE USEFUL/FLEXIBLE
 * TALK TO AARON BEFORE USING IF YOU HAVE ANY QUESTIONS 🙂
 */



const client = new EscaAPIClient({
  site: `lifeline`,
  environment: `prod`,
  apiKey: process.env.X_API_KEY
})

!async function() {

  let badSkus = [] //[`YMTCS`, `YMTRRS`]

  console.log("Fetching API products...")
  const products = await client.loadProducts({
    salsify: [`Web Images`],
    byParent: true
  })

  for (let product of products) {
    if (!product[`Web Images`] || !product[`Web Images`].length) {
      badSkus.push(product.sku)
    }

    if (product.variants && product.variants.length) {
      for (let variant of product.variants) {
        if (!variant[`Web Images`] || !variant[`Web Images`].length) {
          badSkus.push(variant.sku)
        }
      }
    }
  }

  console.log(`No Web Images present for SKUs:`)

  let output = ``

  for (let sku of badSkus) {
    try {
      let { data: salsify } = await axios({
        method: `get`,
        url: `https://app.salsify.com/api/v1/orgs/s-9c2a072b-2f59-495e-b089-121deba82448/products/${sku}`,
        headers: {
          Authorization: `Bearer SALSIFY_KEY`
        }
      })

      let assets = salsify[`salsify:digital_assets`] || []
      if (!assets.length) {
        let message = `${sku}: No digital assets`
        output += `\n${message}`
        console.log(message)
        continue
      }

      let someFailed = assets.some(a => a[`salsify:status`] === `failed`)
      let allFailed = assets.every(a => a[`salsify:status`] === `failed`)

      let messageRoot = `No web images in service: `

      let message = allFailed ? `${sku}: ALL uploads failed`
        : someFailed ? `${sku}: SOME uploads failed`
        :`${sku}: Unknown reason`

      output += `\n${message}`
      console.log(message)
    }
    catch(err) {
      let message = `${sku}: (could not get from Salsify)`

      output += `\n${message}`
      console.log(message)
    }
  }

  console.log(`Writing file...`)

  try {
    await writeFile(`${__dirname}/bad-images.txt`, output)
    console.log(`File written.`)
  }
  catch(err) {
    console.error(err)
    console.log(`Could not write file.`)
  }


}()
