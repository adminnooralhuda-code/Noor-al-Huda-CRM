import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/users';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("POST User Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}