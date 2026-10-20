import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// POST - add an emergency contact
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, relation, phone } = await req.json();

    if (!name || !relation || !phone) {
      return NextResponse.json({ message: 'Name, relation, and phone are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { emergencyContacts: { name, relation, phone } } },
      { new: true }
    ).select('-password');

    return NextResponse.json(user.emergencyContacts, { status: 201 });
  } catch (error) {
    console.error('POST /api/user/profile/emergency-contacts error:', error);
    return NextResponse.json({ message: 'Failed to add emergency contact' }, { status: 500 });
  }
}

// DELETE - remove an emergency contact by its subdocument _id
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json({ message: 'contactId query param is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { emergencyContacts: { _id: contactId } } },
      { new: true }
    ).select('-password');

    return NextResponse.json(user.emergencyContacts);
  } catch (error) {
    console.error('DELETE /api/user/profile/emergency-contacts error:', error);
    return NextResponse.json({ message: 'Failed to remove emergency contact' }, { status: 500 });
  }
}
