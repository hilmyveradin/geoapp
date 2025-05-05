import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/gs/layers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(
        "API responded with an error",
        res.status,
        await res.text()
      );
      throw new Error(`API error with status code ${res.status}`);
    }

    const data = await res.json();

    const response = NextResponse.json(data);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse("Internal Server Error", { status: 500 });
  }
}
