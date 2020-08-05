
/**
 * Basic test Netlify function
 */
export async function handler(event, context) {
  const output = {
    message: `I'm a dummy function in the BOILERPLATE!`,
    THINGY: process.env.THINGY
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(output)
  }
}
