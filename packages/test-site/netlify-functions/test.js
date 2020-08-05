import { toDollars } from '@escaladesports/utils'


/**
 * Basic test Netlify function
 */
export async function handler(event, context) {
  const output = {
    message: `I HAVE BEEN OVERRIDDEN!`,
    THINGY: process.env.THINGY,
    fiveDollars: toDollars(500, true)
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(output)
  }
}
