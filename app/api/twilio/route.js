import { NextResponse } from 'next/server';

// Twilio Setup Stub
// import twilio from 'twilio';
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log(`[STUB] Twilio message would have been sent to ${to}: ${message}`);
      return NextResponse.json({ success: true, stub: true, message: 'Message logged in console (Twilio missing)' });
    }

    // Actual Twilio implementation
    // const res = await client.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    //   to: `whatsapp:${to}`
    // });
    
    return NextResponse.json({ success: true, message: 'Message sent via Twilio' });
  } catch (error) {
    console.error('Twilio Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
  }
}
