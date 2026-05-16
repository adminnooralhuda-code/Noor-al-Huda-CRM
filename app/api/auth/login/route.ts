import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // ഫ്രണ്ട്-എൻഡിൽ നിന്ന് username ആയോ email ആയോ വന്നാൽ അത് കൃത്യമായി എടുക്കുന്നു
    const email = body.email || body.username;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // ഡാറ്റാബേസിൽ തിരയുന്നു
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // നിങ്ങളുടെ പാസ്‌വേഡ് ഹാഷിങ് ഇല്ലാതെ നേരിട്ടാണ് ചെക്ക് ചെയ്യുന്നതെങ്കിൽ:
    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // ലോഗിൻ വിജയിച്ചു, യൂസർ വിവരങ്ങൾ അയക്കുന്നു (പാസ്‌വേഡ് ഒഴിവാക്കി)
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });

  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}