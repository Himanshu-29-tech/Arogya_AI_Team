import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// DELETE a chat session
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const deleted = await ChatSession.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deleted) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/chat/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete session' }, { status: 500 });
  }
}
