import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/employee';

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch workforce data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newEmployee = await Employee.create(body);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to register employee" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: "Employee ID required" }, { status: 400 });

    await Employee.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Employee clearance updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Employee termination logging failed" }, { status: 500 });
  }
}