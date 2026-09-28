import { NextResponse } from 'next/server';

/**
 * Standard successful API response
 */
export function apiSuccess<T extends Record<string, unknown>>(
  data?: T,
  status = 200,
  init?: ResponseInit
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...(data ?? {}),
    },
    { status, ...init }
  );
}

/**
 * Standard error API response
 */
export function apiError(
  message: string,
  status = 500,
  init?: ResponseInit
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status, ...init }
  );
}
