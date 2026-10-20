import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ message: 'Phone number (to) and message are required' }, { status: 400 });
    }

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

    // If Twilio credentials are not configured, log and return stub
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.log(`[TWILIO STUB] Would send to ${to}: "${message}"`);
      return NextResponse.json({
        success: true,
        stub: true,
        message: 'Twilio not configured — message logged to console. Add credentials to .env.local to enable real sending.',
      });
    }

    // Dynamic import to avoid requiring Twilio when not configured
    const twilio = (await import('twilio')).default;
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    return NextResponse.json({ success: true, sid: result.sid, message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send message' }, { status: 500 });
  }
}
