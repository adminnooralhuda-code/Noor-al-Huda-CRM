import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Default import കൃത്യമായി സെറ്റ് ചെയ്തു
import mongoose from 'mongoose';

// ડાറ്റാബേസിൽ നിന്ന് യൂസർമാരെ നോക്കാനുള്ള Schema നിർവചനം
const UserSchema = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  role: { type: String, enum: ['Admin', 'Manager', 'Staff'], default: 'Manager' },
  status: { type: String, default: 'Active' }
}));

export async function POST(request: Request) {
  try {
    // നിങ്ങളുടെ ഫയലിലെ connectDB() ഫങ്ക്ഷൻ ഇവിടെ റൺ ചെയ്യുന്നു
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and Password are required" }, { status: 400 });
    }

    // ഡാറ്റാബേസിൽ ഈ യൂസർ ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു
    const user = await mongoose.models.User.findOne({ username: username.toLowerCase() });

    // യൂസർ ഇല്ലെങ്കിലോ പാസ്‌വേഡ് തെറ്റാണെങ്കിലോ
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid Username or Secret Password" }, { status: 401 });
    }

    // യൂസർ അക്കൗണ്ട് ബ്ലോക്ക്ഡ് ആണോ എന്ന് നോക്കുന്നു
    if (user.status !== 'Active') {
      return NextResponse.json({ message: "Your portal access has been suspended" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      username: user.username,
      role: user.role,
      email: user.email
    }, { status: 200 });

  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ message: "Database connection failed or Auth Error" }, { status: 500 });
  }
}