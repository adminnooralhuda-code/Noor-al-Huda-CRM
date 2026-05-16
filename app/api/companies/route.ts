import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/company';

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load company registers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newCompany = await Company.create(body);
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to log company profile" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: "Company ID required" }, { status: 400 });

    await Company.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Company partnership revoked" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to remove company data" }, { status: 500 });
  }
}