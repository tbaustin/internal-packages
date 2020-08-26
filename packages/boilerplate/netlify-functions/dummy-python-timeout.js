

const dummyPythonError = `{errorMessage={"statuscode": 400, "errorMessage": `
  + `"bogus", "response": "{\"errorMessage\":\"2020-08-19T03:25:53.421Z 123xyz `
  + `Task timed out after 10.01 seconds\"}", "time": 1597801327.988059}, `
  + `errorType=Exception, stackTrace=["..."]}`


/**
 * Dummy Netlify function to simulate when a microservice response contains a
 * Python error with a message indicating a gateway timeout
 */
export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: dummyPythonError
  }
}
