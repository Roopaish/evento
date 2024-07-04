import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null
  if (!host && typeof window !== "undefined") {
    // On client side, get the host from window
    host = window.location.host
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0]
    if (candidate && !candidate.includes("localhost")) {
      // Valid candidate
      subdomain = candidate
    }
  }
  return subdomain
}

// RegExp for public files
// const PUBLIC_FILE = /\.(.*)$/ // Files

export async function middleware(req: NextRequest) {
  console.log("Reached Here 1")
  // Clone the URL
  const url = req.nextUrl.clone()

  // Skip public files
  if (url.pathname.includes("_next")) return
  console.log("Reached Here 2")
  const host = req.headers.get("host")
  const subdomain = getValidSubdomain(host)
  if (subdomain) {
    // Subdomain available, rewriting
    console.log(
      `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`
    )
    url.pathname = `/${subdomain}${url.pathname}`
  }

  return NextResponse.rewrite(url)
}
