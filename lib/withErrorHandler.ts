import { NextResponse } from "next/server";
import APIError from "./APIError";

export default async function withErrorHandler(handler: any) {
  try {
    return await handler();
  } catch (err) {
    if (err instanceof APIError) {
      return NextResponse.json(
        { error: true, message: err.message },
        { status: err.status }
      );
    }

    console.error("Unhandled error", err);
    return NextResponse.json(
      {
        error: true,
        message: `An unexpected error occurred. Please try again later or contact us if the issue persists`,
      },
      { status: 500 }
    );
  }
}
