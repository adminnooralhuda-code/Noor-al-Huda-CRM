import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }); // സുരക്ഷയ്ക്കായി പാസ്‌വേഡ് ഒഴിവാക്കി എടുക്കുന്നു
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load portal key registers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newUser = await User.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.code === 11000 ? "Username already exists" : "Failed to provision portal keys" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User access clearance completely revoked" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Identity purge sequence failed" }, { status: 500 });
  }
}