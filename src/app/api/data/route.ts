import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET — load user's data from Neon DB
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await prisma.userData.findUnique({
      where: { userId: session.userId },
    });

    return NextResponse.json({
      data: userData?.data ?? null,
    });
  } catch (err) {
    console.error("Data GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — save user's data to Neon DB
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data } = body;

    await prisma.userData.upsert({
      where: { userId: session.userId },
      update: { data },
      create: { userId: session.userId, data },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Data POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
