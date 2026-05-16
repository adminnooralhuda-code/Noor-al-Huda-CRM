import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/users'; // നിങ്ങളുടെ കൃത്യമായ മോഡൽ പാത്ത്

export async function POST(request: Request) {
  try {
    // 1. ഡാറ്റാബേസ് കണക്ഷൻ ഉറപ്പാക്കുന്നു
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // 2. മംഗൂസ് മോഡൽ വഴി കസ്റ്റമറെ കണ്ടെത്തുന്നു
    const customer = await User.findOne({ email, role: 'customer' });

    if (!customer) {
      return NextResponse.json({ message: "Customer data clearance missing or unauthorized" }, { status: 404 });
    }

    // കസ്റ്റമർ ഡാറ്റ വിജയകരമായി റിട്ടേൺ ചെയ്യുന്നു
    return NextResponse.json(customer, { status: 200 });

  } catch (error: any) {
    console.error("Customer Data API Error:", error);
    return NextResponse.json({ message: "Internal server error during data retrieval" }, { status: 500 });
  }
}