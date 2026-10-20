import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

// PATCH - toggle active or update a medicine
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    const medicine = await Medicine.findOne({ _id: id, userId: session.user.id });
    if (!medicine) {
      return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
    }

    // Apply partial updates
    Object.assign(medicine, body);
    await medicine.save();

    return NextResponse.json(medicine);
  } catch (error) {
    console.error('PATCH /api/medicines/[id] error:', error);
    return NextResponse.json({ message: 'Failed to update medicine' }, { status: 500 });
  }
}

// DELETE a medicine
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const deleted = await Medicine.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deleted) {
      return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/medicines/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete medicine' }, { status: 500 });
  }
}
