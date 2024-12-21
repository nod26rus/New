import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function adminMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token || token.role !== "admin") {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}