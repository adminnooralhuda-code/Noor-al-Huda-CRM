// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('NoorAlHudaCRM');
    
    // ഡാറ്റാബേസിൽ ഈ ഇമെയിൽ ഉള്ള യൂസറെ തിരയുന്നു
    const user = await db.collection('users').findOne({ email: email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // സുരക്ഷയ്ക്ക് വേണ്ടി പാസ്‌വേർഡ് ചെക്ക് ചെയ്യുന്നു (ലളിതമായ രീതിയിൽ)
    // NB: പിന്നീട് നമ്മൾ ഇത് bcrypt ഉപയോഗിച്ച് കൂടുതൽ സെക്യൂർ ആക്കും
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    
    // ലോഗിൻ സക്സസ് ആയാൽ യൂസറുടെ പേരും റോളും തിരിച്ചു അയക്കുന്നു
    return NextResponse.json({ 
      success: true, 
      user: { name: user.name, role: user.role, email: user.email } 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}