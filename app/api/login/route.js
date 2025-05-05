import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const res = await fetch("http://dev3.webgis.co.id/api/iam/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
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

    // Assuming 'data' contains your tokens
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    // Set your tokens here as cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
