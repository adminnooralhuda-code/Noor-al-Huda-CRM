// app/api/staff-data/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); 

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('NoorAlHudaCRM');

    // 1. Staff-ne kandu-pidikkunnu
    const staff = await db.collection('users').findOne({ email, role: 'staff' });
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const allowedIds = staff.accessibleCompanies || [];

    // ObjectId-kkum String-num vendi raddum dynamic aayi convert cheyyunnu
    const objectIds = allowedIds.map((id: string) => {
      try {
        return new ObjectId(id);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    // 2. Allowed Companies edukkunnu (Both String and ObjectId matched)
    const companies = await db.collection('companies').find({
      $or: [
        { _id: { $in: objectIds } },
        { _id: { $in: allowedIds } },
        { tradeLicense: { $in: allowedIds } } // Safe side-il trade license matchum nokkunnu
      ]
    }).toArray();

    // Iniyulla queries-nu vendi actual company IDs string array aakkunnu
    const fetchedCompanyIds = companies.map(c => c._id.toString());

    // 3. Ee companies-ile Employees-ne mathram edukkunnu
    const employees = await db.collection('employees').find({
      companyId: { $in: fetchedCompanyIds }
    }).toArray();

    return NextResponse.json({ 
      staffName: staff.name, 
      companies, 
      employees 
    });

  } catch (error) {
    console.error('Staff Data API Error:', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}