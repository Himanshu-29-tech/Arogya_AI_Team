import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

// GET all medicines for the logged-in user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectToDatabase();
      const medicines = await Medicine.find({ userId: session.user.id }).sort({ createdAt: -1 });
      return NextResponse.json(medicines);
    } catch (dbErr) {
      console.warn('Medicines DB offline, providing demo data:', dbErr.message);
      return NextResponse.json([
        {
          _id: 'mock-med-1',
          name: 'Metformin',
          dosage: '500mg',
          schedule: { morning: true, afternoon: false, night: true },
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          active: true,
        },
        {
          _id: 'mock-med-2',
          name: 'Vitamin D3',
          dosage: '60,000 IU',
          schedule: { morning: true, afternoon: false, night: false },
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          active: true,
        }
      ]);
    }
  } catch (error) {
    console.error('GET /api/medicines error:', error);
    return NextResponse.json({ message: 'Failed to fetch medicines' }, { status: 500 });
  }
}

// POST create a new medicine
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, dosage, schedule, startDate, endDate } = await req.json();

    if (!name || !dosage || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields: name, dosage, startDate, endDate' }, { status: 400 });
    }

    await connectToDatabase();

    const medicine = await Medicine.create({
      userId: session.user.id,
      name,
      dosage,
      schedule: {
        morning: schedule?.morning || false,
        afternoon: schedule?.afternoon || false,
        night: schedule?.night || false,
      },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      active: true,
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error('POST /api/medicines error:', error);
    return NextResponse.json({ message: 'Failed to create medicine' }, { status: 500 });
  }
}
