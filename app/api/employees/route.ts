import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/employee';

// 1. GET: എല്ലാ ജീവനക്കാരുടെയും ലിസ്റ്റ് എടുക്കാൻ
export async function GET() {
  try {
    await connectDB();
    // populate('companyId') നൽകിയതിനാൽ ജീവനക്കാരൻ ഏത് കമ്പനിയിലാണ് ഉള്ളതെന്ന് ഓട്ടോമാറ്റിക് ആയി ലിങ്ക് ആയിക്കോളും
    const employees = await Employee.find({}).populate('companyId').sort({ createdAt: -1 });
    return NextResponse.json(employees, { status: 200 });
  } catch (error: any) {
    console.error("Employee GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch workforce data" }, { status: 500 });
  }
}

// 2. POST: പുതിയ ജീവനക്കാരനെ ക്ലൗഡ് DB-യിൽ ചേർക്കാൻ
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const count = await Employee.countDocuments();
    const employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;

    // ശൂന്യമായ ലിങ്കുകൾ ഉണ്ടെങ്കിൽ അത് കൃത്യമായി കൈകാര്യം ചെയ്യാൻ
    if (body.companyId === "") delete body.companyId;

    const newEmployee = await Employee.create({
      ...body,
      employeeId
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error("Employee POST Error:", error);
    return NextResponse.json({ message: "Failed to onboard employee to cloud roster" }, { status: 500 });
  }
}

// 3. PUT: ജീവനക്കാരന്റെ വിസ/പാസ്‌പോർട്ട് വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യാൻ
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ message: "Employee ID is required" }, { status: 400 });
    if (body.companyId === "") body.companyId = null;

    await Employee.findByIdAndUpdate(id, body);
    return NextResponse.json({ success: true, message: "Workforce file logs updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Employee PUT Error:", error);
    return NextResponse.json({ message: "Failed to modify worker profile" }, { status: 500 });
  }
}

// 4. DELETE: ജീവനക്കാരനെ ഒഴിവാക്കാൻ
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: "Employee ID is required" }, { status: 400 });

    await Employee.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Employee file profile canceled" }, { status: 200 });
  } catch (error: any) {
    console.error("Employee DELETE Error:", error);
    return NextResponse.json({ message: "Failed to remove employee record" }, { status: 500 });
  }
}