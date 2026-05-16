import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // മംഗൂസ് വഴി സ്റ്റാഫിനെ കണ്ടെത്തുന്നു
    const staff = await User.findOne({ email, role: 'staff' });

    if (!staff) {
      return NextResponse.json({ message: "Staff data clearance missing or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(staff, { status: 200 });

  } catch (error: any) {
    console.error("Staff Data API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}