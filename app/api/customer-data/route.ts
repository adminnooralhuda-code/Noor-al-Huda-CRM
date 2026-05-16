// app/api/customer-data/route.ts
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

    // 1. Customer അക്കൗണ്ട് കണ്ടെത്തുന്നു
    const customer = await db.collection('users').findOne({ email, role: 'customer' });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    // കസ്റ്റമർക്ക് അനുവദിച്ച കമ്പനി ഐഡികൾ എടുക്കുന്നു (ഇല്ലെങ്കിൽ പഴയ സിസ്റ്റം ബായ്ക്കപ്പ് ആയി ലൈസൻസ് നോക്കും)
    const allowedIds = customer.accessibleCompanies || [];
    
    const objectIds = allowedIds.map((id: string) => {
      try { return new ObjectId(id); } catch (e) { return null; }
    }).filter(Boolean);

    // 2. ആ കസ്റ്റമറുടെ എല്ലാ കമ്പനികളും ഡാറ്റാബേസിൽ നിന്ന് എടുക്കുന്നു
    const companies = await db.collection('companies').find({
      $or: [
        { _id: { $in: objectIds } },
        { _id: { $in: allowedIds } },
        { tradeLicense: customer.companyLicense } // പഴയ കസ്റ്റമർമാർക്ക് വേണ്ടിയുള്ള സേഫ്റ്റി ലോജിക്
      ]
    }).toArray();

    const companyIdsStrings = companies.map(c => c._id.toString());

    // 3. ആ കമ്പനികളിലെ മുഴുവൻ ജീവനക്കാരുടെയും വിവരങ്ങൾ എടുക്കുന്നു
    const employees = await db.collection('employees').find({
      companyId: { $in: companyIdsStrings }
    }).toArray();

    return NextResponse.json({
      customerName: customer.name,
      companies, // ഒന്നിലധികം കമ്പനികൾ പോകും
      employees
    });

  } catch (error) {
    console.error('Customer API Error:', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}