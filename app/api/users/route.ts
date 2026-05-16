import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

// POST മെത്തേഡ് കൃത്യമായി ഡിഫൈൻ ചെയ്യുന്നു
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // പുതിയ യൂസറെ ഉണ്ടാക്കുന്നു
    const newUser = new User({
      name,
      email,
      password,
      role: role.toLowerCase().includes('manager') ? 'manager' : role.toLowerCase().includes('admin') ? 'admin' : 'staff'
    });

    await newUser.save();
    return NextResponse.json({ success: true, message: "Account authorized successfully!" }, { status: 201 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}