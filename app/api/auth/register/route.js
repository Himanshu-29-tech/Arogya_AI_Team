import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { demoStore } from '@/lib/demoStore';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      await connectToDatabase();

      // Check if user exists in MongoDB
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in MongoDB
      await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });

      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (dbErr) {
      console.warn('MongoDB connection unavailable, registering user in demo store:', dbErr.message);

      if (demoStore.users.has(normalizedEmail)) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      demoStore.users.set(normalizedEmail, {
        id: `demo-${Date.now()}`,
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: 'user',
      });

      return NextResponse.json({ message: 'User registered successfully (demo session mode)' }, { status: 201 });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}
