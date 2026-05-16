import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users';

export async function POST(request: Request) {
  try {
    // 1. ഡാറ്റാബേസ് കണക്ട് ചെയ്യുന്നു
    await connectDB();

    // 2. ഫ്രണ്ട്എൻഡിൽ നിന്ന് വരുന്ന ഡാറ്റ എടുക്കുന്നു
    const body = await request.json();
    const { name, email, password, role } = body;

    // ഡാറ്റ ഉണ്ടോ എന്ന് ചെക്ക് ചെയ്യുന്നു
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 3. ഈ ഇമെയിൽ ഓൾറെഡി ഡാറ്റാബേസിൽ ഉണ്ടോ എന്ന് നോക്കുന്നു
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // 4. പുതിയ യൂസറെ ഉണ്ടാക്കുന്നു
    const newUser = new User({
      name,
      email,
      password, // ലോക്കലിൽ ഉപയോഗിച്ച അതേ പ്ലെയിൻ ടെക്സ്റ്റ് രീതി
      role: role.toLowerCase().includes('manager') ? 'manager' : role.toLowerCase().includes('admin') ? 'admin' : 'staff' 
      // (ഡ്രോപ്പ്ഡൗണിൽ നിന്ന് വലിയ അക്ഷരത്തിൽ വന്നാലും കറക്റ്റ് ആയി റോൾ അസൈൻ ചെയ്യാൻ വേണ്ടിയാണിത്)
    });

    // 5. ഡാറ്റാബേസിലേക്ക് സേവ് ചെയ്യുന്നു
    await newUser.save();

    return NextResponse.json({ success: true, message: "Account authorized successfully!" }, { status: 201 });

  } catch (error: any) {
    console.error("Create User API Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}