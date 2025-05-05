import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const res = await fetch(`${process.env.API_BASE_URL}/adm/group/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(
        "API responded with an error",
        res.status,
        await res.text()
      );
      // Instead of throwing an error, we are returning a NextResponse object with a status code
      return new NextResponse(
        `foobar!!! ${{ res }}`,
        { status: res.status },
        ""
      );
    }

    const data = await res.json();

    // Create a new instance of NextResponse with the 'new' keyword
    const response = new NextResponse(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200, // You can set the status code here if needed
    });

    return response;
  } catch (error) {
    console.error(error);
    // Make sure to use 'new' keyword to create a new NextResponse instance
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
