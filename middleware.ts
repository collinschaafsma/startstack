import { auth } from "@/auth"

export default auth(req => {
  // Look for session required routes
  if (
    !req.auth &&
    ["/account"].some(route => req.nextUrl.pathname.includes(route))
  ) {
    const newUrl = new URL(
      `/sign-in?redirectTo=${req.nextUrl.pathname}`,
      req.nextUrl.origin
    )
    return Response.redirect(newUrl)
  }

  // Look for admin session required routes
  if (
    req.auth?.user.role !== "admin" &&
    ["/dashboard"].some(route => req.nextUrl.pathname.includes(route))
  ) {
    const newUrl = new URL(
      `/sign-in?redirectTo=${req.nextUrl.pathname}`,
      req.nextUrl.origin
    )
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
}

// If you don't want to use the middleware to check for the role and the page they are on
// and you would rather handle that on a page level, you can use the following code
// and check for the role in the layout/page RSC.
/*
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
*/
