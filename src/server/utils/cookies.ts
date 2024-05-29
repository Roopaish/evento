export function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/;`
}

export function getCookie(name: string) {
  if (typeof document !== "undefined") {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts?.pop()?.split(";").shift()
  } else {
    return ""
  }
}

export function getCookieFromCookies({
  cookies,
  key,
}: {
  cookies: string
  key: string
}) {
  const value = `${cookies}`
  const parts = value.split(`; ${key}=`)
  if (parts.length === 2) return parts?.pop()?.split(";").shift()
}
