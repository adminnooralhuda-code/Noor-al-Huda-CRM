import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Company from '../../../models/company';

export async function GET() {
  try {
    await connectToDatabase();
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("GET Companies Error:", error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newCompany = await Company.create(data);
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: any) {
    console.error("POST Company Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}