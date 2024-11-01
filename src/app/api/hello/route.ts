import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  console.log(request)
  return NextResponse.json({ hello: 'hello' }, { status: 200 })
}