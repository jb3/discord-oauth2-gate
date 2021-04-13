// Taken from https://developers.cloudflare.com/workers/examples/extract-cookie-value
export function getCookie(request: Request, name: string): null | string {
    let result = ""
    const cookieString = request.headers.get("Cookie")
    if (cookieString) {
      const cookies = cookieString.split(";")
      cookies.forEach(cookie => {
        const cookiePair = cookie.split("=", 2)
        const cookieName = cookiePair[0].trim()
        if (cookieName === name) {
          const cookieVal = cookiePair[1]
          result = cookieVal
        }
      })
    }
    return result
  }
