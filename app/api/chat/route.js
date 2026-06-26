import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

const SYSTEM_PROMPT = `You are Arogya AI, a highly advanced, empathetic, and professional AI healthcare companion. 
Your goal is to help users understand their symptoms, explain medical reports, and guide them on when to seek professional medical help.
Guidelines:
1. NEVER diagnose. Always state that you are an AI and not a doctor.
2. If symptoms are severe (e.g., chest pain, difficulty breathing, sudden severe headache), immediately advise the user to seek emergency medical attention or click the SOS button.
3. Provide possible causes, severity assessment, home remedies for minor issues, and when to visit a doctor.
4. Keep formatting clean using markdown. Use bullet points and bold text for readability.
5. Be culturally sensitive and acknowledge Indian contexts if applicable (e.g., common local names for conditions if asked).`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    await connectToDatabase();

    let chatSession;
    let history = [];

    // Find or create session
    if (sessionId) {
      chatSession = await ChatSession.findOne({ _id: sessionId, userId: session.user.id });
      if (!chatSession) return NextResponse.json({ message: 'Session not found' }, { status: 404 });
      
      // Format history for Gemini API
      history = chatSession.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    } else {
      // Create new session
      const title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
      chatSession = await ChatSession.create({
        userId: session.user.id,
        title,
        messages: [],
      });
    }

    // Add user message to DB
    chatSession.messages.push({ role: 'user', content: message });
    await chatSession.save();

    let modelResponseText = '';

    // If no API key is set, return mock response for MVP
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
       console.warn('Using mock Gemini response because API key is missing.');
       modelResponseText = `*This is a mock response because the Gemini API key is not configured.* \n\nI understand you are experiencing: "${message}". \n\n**Possible Causes:**\n- Common cold or viral infection\n- Stress or fatigue\n\n**Severity:** Mild to Moderate\n\n**Home Remedies:**\n- Stay hydrated and rest\n- Over-the-counter pain relievers if needed\n\n**When to see a doctor:**\nIf symptoms persist for more than 3 days or worsen, please consult a healthcare professional. \n\n*Note: I am an AI, not a doctor.*`;
       
       // Simulate network delay
       await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
       // Call real Gemini API
       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
       const chat = model.startChat({
         history: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood. I will act as Arogya AI.' }] },
            ...history
         ],
       });

       const result = await chat.sendMessage(message);
       const response = await result.response;
       modelResponseText = response.text();
    }

    // Add AI response to DB
    chatSession.messages.push({ role: 'model', content: modelResponseText });
    await chatSession.save();

    return NextResponse.json({ 
      sessionId: chatSession._id, 
      response: modelResponseText,
      title: chatSession.title
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get URL params
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const chatSession = await ChatSession.findOne({ _id: sessionId, userId: session.user.id });
      return NextResponse.json(chatSession);
    } else {
      const sessions = await ChatSession.find({ userId: session.user.id })
        .sort({ updatedAt: -1 })
        .select('_id title updatedAt');
      return NextResponse.json(sessions);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch sessions' }, { status: 500 });
  }
}
