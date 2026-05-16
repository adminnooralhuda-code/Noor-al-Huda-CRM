import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}