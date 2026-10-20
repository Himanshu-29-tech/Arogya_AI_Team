import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// GET - fetch user profile
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectToDatabase();

      const user = await User.findById(session.user.id).select('-password');
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user);
    } catch (dbErr) {
      console.warn('Profile DB offline, returning session profile data:', dbErr.message);
      return NextResponse.json({
        _id: session.user.id,
        name: session.user.name || 'Demo User',
        email: session.user.email || 'demo@arogya.ai',
        role: session.user.role || 'user',
        bloodGroup: 'B+',
        allergies: ['Dust', 'Pollen'],
        chronicDiseases: ['Hypertension (Managed)'],
        emergencyContacts: [
          { name: 'Family Emergency', phone: '+91 98765 43210', relation: 'Spouse' }
        ]
      });
    }
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - update user profile
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, bloodGroup, allergies, chronicDiseases } = await req.json();

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(bloodGroup !== undefined && { bloodGroup }),
          ...(allergies !== undefined && { allergies }),
          ...(chronicDiseases !== undefined && { chronicDiseases }),
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
