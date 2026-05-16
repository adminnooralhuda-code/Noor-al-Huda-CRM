import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/company';

// 1. GET: എല്ലാ കമ്പനികളുടെയും ലിസ്റ്റ് ക്ലൗഡ് DB-യിൽ നിന്ന് എടുക്കാൻ
export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return NextResponse.json(companies, { status: 200 });
  } catch (error: any) {
    console.error("Company GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch companies from cloud database" }, { status: 500 });
  }
}

// 2. POST: പുതിയ കമ്പനി ക്ലൗഡ് DB-യിലേക്ക് സേവ് ചെയ്യാൻ
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // തനതായ ഒരു കമ്പനി കോഡ് ഡാറ്റാബേസ് കൗണ്ട് വെച്ച് ഉണ്ടാക്കുന്നു (e.g., C-001)
    const count = await Company.countDocuments();
    const companyCode = `C-${String(count + 1).padStart(3, '0')}`;
    
    const newCompany = await Company.create({
      ...body,
      companyCode
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: any) {
    console.error("Company POST Error:", error);
    return NextResponse.json({ message: error.message || "Failed to register company" }, { status: 500 });
  }
}

// 3. PUT: നിലവിലുള്ള കമ്പനിയുടെ വിവരങ്ങൾ മാറ്റാൻ (Admin & Manager)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Company Database ID is required" }, { status: 400 });
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedCompany) {
      return NextResponse.json({ message: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Company registry synchronized successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Company PUT Error:", error);
    return NextResponse.json({ message: "Failed to update company log" }, { status: 500 });
  }
}

// 4. DELETE: കമ്പനി പൂർണ്ണമായി നീക്കം ചെയ്യാൻ (Admin Only)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "Company Database ID is required" }, { status: 400 });
    }

    await Company.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Company files completely wiped from cloud partition" }, { status: 200 });
  } catch (error: any) {
    console.error("Company DELETE Error:", error);
    return NextResponse.json({ message: "Failed to delete company profile" }, { status: 500 });
  }
}