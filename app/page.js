// app/page.js
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login`);
  } else {
    redirect(`/app/layers`);
  }

  // This return statement will never be reached due to the redirects above,
  // but we'll keep it for completeness
  // return <HomeContent />;
}
