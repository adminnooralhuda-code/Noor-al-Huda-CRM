import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Employee from '../../../models/employee';

export async function GET() {
  try {
    await connectToDatabase();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("GET Employees Error:", error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newEmployee = await Employee.create(data);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error("POST Employee Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create employee' }, { status: 500 });
  }
}